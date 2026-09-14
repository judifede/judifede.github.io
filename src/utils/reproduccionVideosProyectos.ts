const SELECTOR_VIDEO_PROYECTO = 'video[data-video-proyecto]'
const UMBRAL_VISIBILIDAD = 0.6
const PREFERENCIA_MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const UMBRALES_OBSERVACION = Array.from({ length: 101 }, (_, indice) => indice / 100)

interface ConexionConAhorroDeDatos {
  readonly saveData?: boolean
}

type NavegadorConConexion = Navigator & {
  readonly connection?: ConexionConAhorroDeDatos
}

interface EstadoVideo {
  ratioInterseccion: number
  pausaManual: boolean
  pausaAutomaticaPendiente: boolean
  reproduccionAutomaticaPendiente: boolean
}

let limpiarGestionActual: (() => void) | null = null

function tieneAhorroDeDatos(): boolean {
  return (navigator as NavegadorConConexion).connection?.saveData === true
}

function iniciarGestionVideos(): () => void {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(SELECTOR_VIDEO_PROYECTO))
  if (videos.length === 0) return () => undefined

  const preferenciaMovimiento = window.matchMedia(PREFERENCIA_MOVIMIENTO_REDUCIDO)
  const estados = new Map<HTMLVideoElement, EstadoVideo>(
    videos.map((video) => [
      video,
      {
        ratioInterseccion: 0,
        pausaManual: false,
        pausaAutomaticaPendiente: false,
        reproduccionAutomaticaPendiente: false,
      },
    ])
  )
  let videoActivo: HTMLVideoElement | null = null
  let gestionDestruida = false

  function obtenerEstado(video: HTMLVideoElement): EstadoVideo | undefined {
    return estados.get(video)
  }

  function pausarAutomaticamente(video: HTMLVideoElement): void {
    const estado = obtenerEstado(video)
    if (!estado || video.paused) return

    estado.pausaAutomaticaPendiente = true
    video.pause()
  }

  function reproducirAutomaticamente(video: HTMLVideoElement): void {
    const estado = obtenerEstado(video)
    if (!estado || !video.paused) return

    estado.reproduccionAutomaticaPendiente = true
    video.muted = true

    void video.play().catch(() => {
      estado.reproduccionAutomaticaPendiente = false
      if (videoActivo === video) videoActivo = null
    })
  }

  function estaPermitidaLaReproduccionAutomatica(): boolean {
    return !preferenciaMovimiento.matches && !tieneAhorroDeDatos()
  }

  function elegirVideoVisible(): HTMLVideoElement | null {
    let mejorVideo: HTMLVideoElement | null = null
    let mejorRatio = UMBRAL_VISIBILIDAD

    estados.forEach((estado, video) => {
      if (estado.pausaManual || estado.ratioInterseccion < mejorRatio) return

      if (estado.ratioInterseccion > mejorRatio || mejorVideo === null) {
        mejorVideo = video
        mejorRatio = estado.ratioInterseccion
      }
    })

    return mejorVideo
  }

  function reevaluarReproduccion(): void {
    if (gestionDestruida || document.hidden || !estaPermitidaLaReproduccionAutomatica()) {
      if (videoActivo) pausarAutomaticamente(videoActivo)
      videoActivo = null
      return
    }

    const mejorVideo = elegirVideoVisible()

    if (videoActivo && videoActivo !== mejorVideo) {
      pausarAutomaticamente(videoActivo)
    }

    estados.forEach((estado, video) => {
      if (video !== mejorVideo && estado.ratioInterseccion >= UMBRAL_VISIBILIDAD) {
        pausarAutomaticamente(video)
      }
    })

    videoActivo = mejorVideo
    if (videoActivo) reproducirAutomaticamente(videoActivo)
  }

  function alReproducir(evento: Event): void {
    const video = evento.currentTarget as HTMLVideoElement
    const estado = obtenerEstado(video)
    if (!estado) return

    if (estado.reproduccionAutomaticaPendiente) {
      estado.reproduccionAutomaticaPendiente = false
      return
    }

    estado.pausaManual = false
    reevaluarReproduccion()
  }

  function alPausar(evento: Event): void {
    const video = evento.currentTarget as HTMLVideoElement
    const estado = obtenerEstado(video)
    if (!estado) return

    if (estado.pausaAutomaticaPendiente) {
      estado.pausaAutomaticaPendiente = false
      return
    }

    estado.pausaManual = true
    if (videoActivo === video) videoActivo = null
    reevaluarReproduccion()
  }

  function alCambiarVisibilidadDocumento(): void {
    reevaluarReproduccion()
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        const video = entrada.target as HTMLVideoElement
        const estado = obtenerEstado(video)
        if (estado) estado.ratioInterseccion = entrada.intersectionRatio
      })

      reevaluarReproduccion()
    },
    { threshold: UMBRALES_OBSERVACION }
  )

  videos.forEach((video) => {
    video.addEventListener('play', alReproducir)
    video.addEventListener('pause', alPausar)
    observador.observe(video)
  })
  document.addEventListener('visibilitychange', alCambiarVisibilidadDocumento)
  preferenciaMovimiento.addEventListener('change', reevaluarReproduccion)

  return () => {
    gestionDestruida = true
    observador.disconnect()
    document.removeEventListener('visibilitychange', alCambiarVisibilidadDocumento)
    preferenciaMovimiento.removeEventListener('change', reevaluarReproduccion)
    videos.forEach((video) => {
      video.removeEventListener('play', alReproducir)
      video.removeEventListener('pause', alPausar)
    })
    if (videoActivo) videoActivo.pause()
  }
}

function inicializarVideosProyectos(): void {
  limpiarGestionActual?.()
  limpiarGestionActual = iniciarGestionVideos()
}

function limpiarVideosProyectos(): void {
  limpiarGestionActual?.()
  limpiarGestionActual = null
}

document.addEventListener('astro:page-load', inicializarVideosProyectos)
document.addEventListener('astro:before-swap', limpiarVideosProyectos)
