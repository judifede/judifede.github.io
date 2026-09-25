/**
 * Controlador de la galería unificada.
 *
 * Estrategia:
 *  - Una sola instancia de la clase `GaleriaController` por `<dialog>`
 *    (identificado por su atributo `data-galeria-modal="<idInstancia>"`).
 *  - Se vincula en `DOMContentLoaded` y en `astro:page-load`. Para evitar
 *    duplicaciones tras navegaciones de Astro, antes de crear nuevas
 *    instancias se limpian las anteriores (WeakRef + limpieza explícita).
 *  - Mantiene un Map en `window` para que múltiples instancias en la misma
 *    página coexistan sin pisarse.
 */

type GaleriaItem = {
  src: string
  width: number
  height: number
  alt: string
  fit: 'encajar' | 'recortar'
}

const AJUSTE_CLASE: Record<GaleriaItem['fit'], string> = {
  encajar: 'object-contain',
  recortar: 'object-cover',
}

const SWIPE_UMBRAL_PX = 50
const KEY_IZQUIERDA = ['ArrowLeft']
const KEY_DERECHA = ['ArrowRight']
const DURACION_AUTOHIDE_CONTROLES_MS = 3000

type Limpieza = () => void

interface RegistroGaleria {
  instancias: Map<string, GaleriaController>
  limpieza: Limpieza
}

const CLAVE_GLOBAL = '__galeriaUnificada'

function obtenerRegistro(): RegistroGaleria {
  const w = window as unknown as Record<string, RegistroGaleria | undefined>
  if (!w[CLAVE_GLOBAL]) {
    w[CLAVE_GLOBAL] = {
      instancias: new Map<string, GaleriaController>(),
      limpieza: () => {
        for (const c of w[CLAVE_GLOBAL]!.instancias.values()) c.destruir()
        w[CLAVE_GLOBAL]!.instancias.clear()
      },
    }
  }
  return w[CLAVE_GLOBAL]!
}

class GaleriaController {
  private readonly boton: HTMLButtonElement
  private readonly modal: HTMLDialogElement
  private readonly imagen: HTMLImageElement
  private readonly contador: HTMLElement
  private readonly tira: HTMLElement | null
  private readonly prev: HTMLButtonElement | null
  private readonly next: HTMLButtonElement | null
  private readonly cerrar: HTMLButtonElement
  private readonly items: GaleriaItem[]
  private indice = 0
  private readonly listenersBoton: Limpieza[] = []
  private readonly listenersModal: Limpieza[] = []
  private readonly listenersTeclado: Limpieza[] = []
  private readonly listenersSwipe: Limpieza[] = []
  private readonly listenersMiniaturas: Limpieza[] = []
  private readonly listenersZoom: Limpieza[] = []
  private readonly zoomControles: HTMLElement | null
  private readonly zoomIn: HTMLButtonElement | null
  private readonly zoomOut: HTMLButtonElement | null
  private readonly zoomReset: HTMLButtonElement | null
  private readonly zoomNiveles = [1, 2, 3] as const
  private zoomIndice = 0
  private zoomArrastrando = false
  private zoomArrastreX = 0
  private zoomArrastreY = 0
  private zoomArrastreInicioX = 0
  private zoomArrastreInicioY = 0
  private touchInicioX = 0
  private touchInicioY = 0
  private readonly UMBRAL_MOVIMIENTO_PX = 5
  private timerOcultarControles: number | null = null

  constructor(opts: {
    boton: HTMLButtonElement
    modal: HTMLDialogElement
    imagen: HTMLImageElement
    contador: HTMLElement
    tira: HTMLElement | null
    prev: HTMLButtonElement | null
    next: HTMLButtonElement | null
    cerrar: HTMLButtonElement
    zoomIn: HTMLButtonElement | null
    zoomOut: HTMLButtonElement | null
    zoomReset: HTMLButtonElement | null
    zoomControles: HTMLElement | null
    items: GaleriaItem[]
  }) {
    this.boton = opts.boton
    this.modal = opts.modal
    this.imagen = opts.imagen
    this.contador = opts.contador
    this.tira = opts.tira
    this.prev = opts.prev
    this.next = opts.next
    this.cerrar = opts.cerrar
    this.zoomIn = opts.zoomIn
    this.zoomOut = opts.zoomOut
    this.zoomReset = opts.zoomReset
    this.zoomControles = opts.zoomControles
    this.items = opts.items

    this.vincular()
    this.vincularZoom()
  }

  private vincular(): void {
    // Botón abrir
    const abrir = (ev: Event) => {
      ev.preventDefault()
      this.abrir()
    }
    this.boton.addEventListener('click', abrir)
    this.listenersBoton.push(() => this.boton.removeEventListener('click', abrir))

    // Botón cerrar (X)
    const cerrar = (ev: Event) => {
      ev.preventDefault()
      this.cerrarModal()
    }
    this.cerrar.addEventListener('click', cerrar)
    this.listenersBoton.push(() => this.cerrar.removeEventListener('click', cerrar))

    // Click en backdrop (target === dialog)
    const backdrop = (ev: MouseEvent) => {
      if (ev.target === this.modal) {
        this.cerrarModal()
      }
    }
    this.modal.addEventListener('click', backdrop)
    this.listenersModal.push(() => this.modal.removeEventListener('click', backdrop))

    // Restaurar foco al cerrar (cubre backdrop, X y Esc)
    const alCerrar = () => {
      this.boton.setAttribute('aria-expanded', 'false')
      this.boton.focus({ preventScroll: true })
    }
    this.modal.addEventListener('close', alCerrar)
    this.listenersModal.push(() => this.modal.removeEventListener('close', alCerrar))

    // Prev / Next
    if (this.prev) {
      const fn = (ev: Event) => {
        ev.preventDefault()
        this.irAnterior()
      }
      this.prev.addEventListener('click', fn)
      this.listenersModal.push(() => this.prev?.removeEventListener('click', fn))
    }
    if (this.next) {
      const fn = (ev: Event) => {
        ev.preventDefault()
        this.irSiguiente()
      }
      this.next.addEventListener('click', fn)
      this.listenersModal.push(() => this.next?.removeEventListener('click', fn))
    }

    // Teclado: ← / → cuando el modal está abierto
    const teclado = (ev: KeyboardEvent) => {
      if (!this.modal.open) return
      if (KEY_IZQUIERDA.includes(ev.key)) {
        ev.preventDefault()
        this.irAnterior()
      } else if (KEY_DERECHA.includes(ev.key)) {
        ev.preventDefault()
        this.irSiguiente()
      }
    }
    document.addEventListener('keydown', teclado)
    this.listenersTeclado.push(() => document.removeEventListener('keydown', teclado))

    // Miniaturas: clic para saltar
    if (this.tira) {
      const miniaturas = Array.from(
        this.tira.querySelectorAll<HTMLButtonElement>('.galeria-miniatura')
      )
      for (const min of miniaturas) {
        const fn = (ev: Event) => {
          ev.preventDefault()
          const i = Number(min.dataset.galeriaIndice ?? '0')
          if (!Number.isNaN(i)) this.irA(i)
        }
        min.addEventListener('click', fn)
        this.listenersMiniaturas.push(() => min.removeEventListener('click', fn))
      }
    }

    // Swipe (Pointer Events) sobre la imagen principal
    this.vincularSwipe()
  }

  private vincularSwipe(): void {
    const main = this.modal.querySelector<HTMLElement>('[data-galeria-main]')
    if (!main) return

    let inicioX = 0
    let inicioY = 0
    let activo = false
    let idPuntero: number | null = null

    const empezar = (ev: PointerEvent) => {
      // Solo swipe horizontal principal (evitamos劫 con scroll vertical).
      if (ev.pointerType === 'mouse') return
      activo = true
      idPuntero = ev.pointerId
      inicioX = ev.clientX
      inicioY = ev.clientY
      try {
        main.setPointerCapture(ev.pointerId)
      } catch {
        /* noop */
      }
    }

    const mover = (ev: PointerEvent) => {
      if (!activo || idPuntero !== ev.pointerId) return
      // Si el desplazamiento vertical supera al horizontal, lo tratamos
      // como scroll y anulamos el swipe.
      const dx = ev.clientX - inicioX
      const dy = ev.clientY - inicioY
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        activo = false
        return
      }
      if (Math.abs(dx) > SWIPE_UMBRAL_PX) {
        if (dx > 0) this.irAnterior()
        else this.irSiguiente()
        activo = false
      }
    }

    const terminar = (ev: PointerEvent) => {
      if (idPuntero !== null && idPuntero === ev.pointerId) {
        try {
          main.releasePointerCapture(ev.pointerId)
        } catch {
          /* noop */
        }
      }
      activo = false
      idPuntero = null
    }

    main.addEventListener('pointerdown', empezar)
    main.addEventListener('pointermove', mover)
    main.addEventListener('pointerup', terminar)
    main.addEventListener('pointercancel', terminar)
    main.addEventListener('pointerleave', terminar)

    this.listenersSwipe.push(() => {
      main.removeEventListener('pointerdown', empezar)
      main.removeEventListener('pointermove', mover)
      main.removeEventListener('pointerup', terminar)
      main.removeEventListener('pointercancel', terminar)
      main.removeEventListener('pointerleave', terminar)
    })
  }

  private abrir(): void {
    if (this.items.length === 0) return
    if (typeof this.modal.showModal === 'function') {
      this.modal.showModal()
    } else {
      this.modal.setAttribute('open', '')
    }
    this.boton.setAttribute('aria-expanded', 'true')
    this.irA(this.indice)
    this.iniciarAutoHide()
    // Foco inicial: el botón cerrar para que Esc lo cierre desde teclado.
    requestAnimationFrame(() => this.cerrar.focus({ preventScroll: true }))
  }

  private cerrarModal(): void {
    if (this.timerOcultarControles !== null) {
      window.clearTimeout(this.timerOcultarControles)
      this.timerOcultarControles = null
    }
    this.modal.classList.remove('controles-visibles')
    this.zoomIndice = 0
    this.zoomArrastreX = 0
    this.zoomArrastreY = 0
    this.zoomArrastrando = false
    this.imagen.style.transform = ''
    this.imagen.classList.remove('zoomed', 'zoom-activo', 'zoom-arrastrable')
    if (typeof this.modal.close === 'function') this.modal.close()
    else this.modal.removeAttribute('open')
  }

  private irAnterior(): void {
    if (this.items.length <= 1) return
    this.irA((this.indice - 1 + this.items.length) % this.items.length)
  }

  private irSiguiente(): void {
    if (this.items.length <= 1) return
    this.irA((this.indice + 1) % this.items.length)
  }

  private irA(i: number): void {
    if (i < 0 || i >= this.items.length) return
    if (this.timerOcultarControles !== null) {
      window.clearTimeout(this.timerOcultarControles)
      this.timerOcultarControles = null
    }
    const item = this.items[i]
    this.indice = i

    this.zoomIndice = 0
    this.zoomArrastreX = 0
    this.zoomArrastreY = 0
    this.touchInicioX = 0
    this.touchInicioY = 0
    this.zoomArrastrando = false
    this.imagen.style.transform = ''
    this.imagen.classList.remove('zoomed', 'zoom-activo', 'zoom-arrastrable')

    this.imagen.src = item.src
    this.imagen.alt = item.alt
    this.imagen.width = item.width
    this.imagen.height = item.height
    this.imagen.style.setProperty('--galeria-ratio', `${item.width} / ${item.height}`)

    const claseActual = this.imagen.className
    const limpia = claseActual
      .split(/\s+/)
      .filter((c) => !c.startsWith('object-'))
      .join(' ')
    this.imagen.className = `${limpia} ${AJUSTE_CLASE[item.fit]}`.trim()

    this.contador.textContent = `${i + 1} / ${this.items.length}`
    this.modal.setAttribute('aria-label', item.alt)

    if (this.tira) {
      const miniaturas = Array.from(
        this.tira.querySelectorAll<HTMLButtonElement>('.galeria-miniatura')
      )
      const activa = miniaturas[i]
      miniaturas.forEach((m, idx) => {
        const seleccionado = idx === i
        m.setAttribute('aria-selected', seleccionado ? 'true' : 'false')
        m.classList.toggle('galeria-miniatura-activa', seleccionado)
      })
      if (activa) this.scrollMiniaturaAlCentro(activa)
    }
  }

  private scrollMiniaturaAlCentro(min: HTMLElement): void {
    if (!this.tira) return
    const reducir =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.tira.scrollTo({
      left: min.offsetLeft - (this.tira.clientWidth - min.clientWidth) / 2,
      behavior: reducir ? 'auto' : 'smooth',
    })
  }

  private vincularZoom(): void {
    const imagen = this.imagen

    const clickFn = (ev: MouseEvent) => {
      ev.preventDefault()
      // Si el click llega mientras el flag de arrastre aún está activo
      // (algunos navegadores entregan `click` antes que `mouseup`/`touchend`),
      // limpiamos el flag para no bloquear el toggle. Sin un arrastre real con
      // movimiento, esto restaura el comportamiento esperado: cada click
      // alterna el zoom.
      this.zoomArrastrando = false
      this.imagen.classList.remove('zoom-arrastrable')
      this.zoomToggle()
    }
    imagen.addEventListener('click', clickFn)
    this.listenersZoom.push(() => imagen.removeEventListener('click', clickFn))

    const wheelFn = (ev: WheelEvent) => {
      ev.preventDefault()
      if (ev.deltaY < 0) {
        this.zoomSubir()
      } else {
        this.zoomBajar()
      }
    }
    imagen.addEventListener('wheel', wheelFn, { passive: false })
    this.listenersZoom.push(() => imagen.removeEventListener('wheel', wheelFn))

    const touchstartFn = (ev: TouchEvent) => {
      if (ev.touches.length === 2) {
        ev.preventDefault()
        const t1 = ev.touches[0]
        const t2 = ev.touches[1]
        if (!t1 || !t2) return
        const distanciaInicial = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        const zoomInicial = this.zoomIndice

        const moveFn = (e: TouchEvent) => {
          if (e.touches.length === 2) {
            e.preventDefault()
            const tt1 = e.touches[0]
            const tt2 = e.touches[1]
            if (!tt1 || !tt2) return
            const distanciaActual = Math.hypot(tt2.clientX - tt1.clientX, tt2.clientY - tt1.clientY)
            const ratio = distanciaInicial > 0 ? distanciaActual / distanciaInicial : 1
            const nuevoZoom = Math.round(zoomInicial + (ratio - 1) * 2)
            this.zoomIndice = Math.max(0, Math.min(this.zoomNiveles.length - 1, nuevoZoom))
            this.aplicarZoom()
          }
        }
        const endFn = () => {
          imagen.removeEventListener('touchmove', moveFn)
          imagen.removeEventListener('touchend', endFn)
          imagen.removeEventListener('touchcancel', endFn)
        }
        imagen.addEventListener('touchmove', moveFn, { passive: false })
        imagen.addEventListener('touchend', endFn)
        imagen.addEventListener('touchcancel', endFn)
      } else if (ev.touches.length === 1 && this.zoomIndice > 0) {
        const t0 = ev.touches[0]
        if (!t0) return
        // NO llamar preventDefault aquí. Eso cancela el click sintético.
        // Marcamos el inicio del posible pan; el click sintético se generará normalmente.
        this.touchInicioX = t0.clientX
        this.touchInicioY = t0.clientY
        this.zoomArrastrando = true
        this.zoomArrastreInicioX = t0.clientX - this.zoomArrastreX
        this.zoomArrastreInicioY = t0.clientY - this.zoomArrastreY
        this.imagen.classList.add('zoom-arrastrable')
      }
    }
    imagen.addEventListener('touchstart', touchstartFn, { passive: false })
    this.listenersZoom.push(() => imagen.removeEventListener('touchstart', touchstartFn))

    const touchmoveFn = (ev: TouchEvent) => {
      if (this.zoomArrastrando && ev.touches.length === 1) {
        const t0 = ev.touches[0]
        if (!t0) return
        // Solo prevenir scroll si hay movimiento real (drag, no tap)
        const dx = t0.clientX - this.touchInicioX
        const dy = t0.clientY - this.touchInicioY
        const esDrag =
          Math.abs(dx) > this.UMBRAL_MOVIMIENTO_PX || Math.abs(dy) > this.UMBRAL_MOVIMIENTO_PX
        if (esDrag) {
          ev.preventDefault()
          this.zoomArrastreX = t0.clientX - this.zoomArrastreInicioX
          this.zoomArrastreY = t0.clientY - this.zoomArrastreInicioY
          this.aplicarZoom()
        }
        // Si es tap (sin movimiento), no hacemos nada y dejamos que el click se genere
      }
    }
    imagen.addEventListener('touchmove', touchmoveFn, { passive: false })
    this.listenersZoom.push(() => imagen.removeEventListener('touchmove', touchmoveFn))

    const touchendFn = () => {
      if (this.zoomArrastrando) {
        this.zoomArrastrando = false
        this.imagen.classList.remove('zoom-arrastrable')
      }
    }
    imagen.addEventListener('touchend', touchendFn)
    imagen.addEventListener('touchcancel', touchendFn)
    this.listenersZoom.push(() => {
      imagen.removeEventListener('touchend', touchendFn)
      imagen.removeEventListener('touchcancel', touchendFn)
    })

    const mousedownFn = (ev: MouseEvent) => {
      if (this.zoomIndice > 0 && ev.button === 0) {
        ev.preventDefault()
        this.zoomArrastrando = true
        this.zoomArrastreInicioX = ev.clientX - this.zoomArrastreX
        this.zoomArrastreInicioY = ev.clientY - this.zoomArrastreY
        this.imagen.classList.add('zoom-arrastrable')
      }
    }
    imagen.addEventListener('mousedown', mousedownFn)
    this.listenersZoom.push(() => imagen.removeEventListener('mousedown', mousedownFn))

    const mousemoveFn = (ev: MouseEvent) => {
      if (this.zoomArrastrando) {
        ev.preventDefault()
        this.zoomArrastreX = ev.clientX - this.zoomArrastreInicioX
        this.zoomArrastreY = ev.clientY - this.zoomArrastreInicioY
        this.aplicarZoom()
      }
    }
    document.addEventListener('mousemove', mousemoveFn)
    this.listenersZoom.push(() => document.removeEventListener('mousemove', mousemoveFn))

    const mouseupFn = () => {
      if (this.zoomArrastrando) {
        this.zoomArrastrando = false
        this.imagen.classList.remove('zoom-arrastrable')
      }
    }
    document.addEventListener('mouseup', mouseupFn)
    this.listenersZoom.push(() => document.removeEventListener('mouseup', mouseupFn))

    const keydownFn = (ev: KeyboardEvent) => {
      if (!this.modal.open) return
      if (ev.key === '+' || ev.key === '=') {
        ev.preventDefault()
        this.zoomSubir()
      } else if (ev.key === '-' || ev.key === '_') {
        ev.preventDefault()
        this.zoomBajar()
      } else if (ev.key === '0') {
        ev.preventDefault()
        this.zoomResetear()
      }
    }
    document.addEventListener('keydown', keydownFn)
    this.listenersZoom.push(() => document.removeEventListener('keydown', keydownFn))
  }

  private zoomSubir(): void {
    if (this.zoomIndice < this.zoomNiveles.length - 1) {
      this.zoomIndice++
      this.aplicarZoom()
    }
  }

  private zoomBajar(): void {
    if (this.zoomIndice > 0) {
      this.zoomIndice--
      this.aplicarZoom()
    }
  }

  private zoomResetear(): void {
    this.zoomIndice = 0
    this.zoomArrastreX = 0
    this.zoomArrastreY = 0
    this.touchInicioX = 0
    this.touchInicioY = 0
    this.zoomArrastrando = false
    this.imagen.classList.remove('zoom-arrastrable')
    this.aplicarZoom()
  }

  private zoomToggle(): void {
    if (this.zoomIndice === 0) {
      this.zoomIndice = 1
      this.aplicarZoom()
    } else {
      this.zoomResetear()
    }
  }

  private iniciarAutoHide(): void {
    const mostrar = () => {
      this.modal.classList.add('controles-visibles')
      if (this.timerOcultarControles !== null) {
        window.clearTimeout(this.timerOcultarControles)
      }
      this.timerOcultarControles = window.setTimeout(() => {
        this.modal.classList.remove('controles-visibles')
      }, DURACION_AUTOHIDE_CONTROLES_MS)
    }
    this.modal.addEventListener('click', mostrar)
    this.modal.addEventListener('touchstart', mostrar, { passive: true })
    mostrar()
  }

  private aplicarZoom(): void {
    const nivel = this.zoomNiveles[this.zoomIndice] ?? 1
    const scale = nivel
    const translateX = this.zoomArrastreX
    const translateY = this.zoomArrastreY
    this.imagen.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    this.imagen.style.transformOrigin = 'center center'

    if (this.zoomIndice > 0) {
      this.imagen.classList.add('zoomed')
      this.imagen.classList.add('zoom-activo')
    } else {
      this.imagen.classList.remove('zoomed')
      this.imagen.classList.remove('zoom-activo')
    }
  }

  destruir(): void {
    const todo: Limpieza[] = [
      ...this.listenersBoton,
      ...this.listenersModal,
      ...this.listenersTeclado,
      ...this.listenersSwipe,
      ...this.listenersMiniaturas,
      ...this.listenersZoom,
    ]
    for (const l of todo) {
      try {
        l()
      } catch {
        /* noop */
      }
    }
  }
}

function bootstrap(): void {
  const registro = obtenerRegistro()

  // Re-vinculación: si ya hay instancias previas en este documento, las
  // destruimos para evitar listeners duplicados tras navegaciones SPA.
  registro.limpieza()

  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[data-galeria-modal]')

  for (const dialog of Array.from(dialogs)) {
    const idInstancia = dialog.dataset.galeriaModal
    if (!idInstancia) continue

    // Botón asociado
    const boton = document.querySelector<HTMLButtonElement>(`[data-galeria-abrir="${idInstancia}"]`)
    if (!boton) continue

    // Items serializados
    const raw = dialog.dataset.galeriaItems
    let items: GaleriaItem[] = []
    try {
      const parsed = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) items = parsed as GaleriaItem[]
    } catch (err) {
      console.warn('[galeria] items JSON inválido para', idInstancia, err)
      continue
    }
    if (items.length === 0) continue

    const imagen = dialog.querySelector<HTMLImageElement>('img.galeria-imagen')
    const contador = dialog.querySelector<HTMLElement>('.galeria-contador')
    const tira = dialog.querySelector<HTMLElement>('.galeria-tira')
    const prev = dialog.querySelector<HTMLButtonElement>('[data-galeria-prev]')
    const next = dialog.querySelector<HTMLButtonElement>('[data-galeria-next]')
    const cerrar = dialog.querySelector<HTMLButtonElement>('[data-galeria-cerrar]')
    const zoomIn = null
    const zoomOut = null
    const zoomReset = null
    const zoomControles = null

    if (!imagen || !contador || !cerrar) continue

    const controller = new GaleriaController({
      boton,
      modal: dialog,
      imagen,
      contador,
      tira,
      prev,
      next,
      cerrar,
      zoomIn,
      zoomOut,
      zoomReset,
      zoomControles,
      items,
    })

    registro.instancias.set(idInstancia, controller)
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', bootstrap)
  document.addEventListener('astro:page-load', bootstrap)
}
