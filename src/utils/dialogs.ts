/**
 * Inicializa los listeners para todos los `<dialog>` que se abran/cierren
 * mediante atributos `data-open-dialog` y `data-close-dialog`.
 *
 * Caracteristicas:
 *  - Idempotente: usa `document.documentElement.dataset.dialogsBound` para
 *    evitar registrar listeners mas de una vez (p. ej. tras navegaciones con
 *    View Transitions de Astro).
 *  - Tambien escucha `astro:page-load` ademas de `DOMContentLoaded`, porque
 *    Astro dispara page-load tras la primera carga y en cada navegacion SPA.
 *  - Respeta `prefers-reduced-motion`: no anade animaciones adicionales;
 *    el `<dialog>` nativo ya cumple.
 *  - Guarda el foco al abrir y lo restaura al cerrar (clic en backdrop,
 *    data-close-dialog o tecla Escape nativa del <dialog>).
 */

const FLAG = 'dialogsBound'

function getDialog(id: string): HTMLDialogElement | null {
  const el = document.getElementById(id)
  if (el && el.tagName.toLowerCase() === 'dialog') {
    return el as HTMLDialogElement
  }
  return null
}

function bind(): void {
  // Evitar doble binding dentro del mismo documento.
  if (document.documentElement.dataset[FLAG] === '1') return
  document.documentElement.dataset[FLAG] = '1'

  // 1) Botones que abren dialogs.
  const openers = document.querySelectorAll<HTMLElement>('[data-open-dialog]')
  openers.forEach((trigger) => {
    if (trigger.dataset.dialogBound === '1') return
    trigger.dataset.dialogBound = '1'

    trigger.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      const id = target.dataset.openDialog
      if (!id) return
      const dialog = getDialog(id)
      if (!dialog) return

      // Guardamos quien abrio para devolver el foco al cerrar.
      dialog.dataset.triggerId =
        target.id || `__dialog_trigger_${Math.random().toString(36).slice(2)}`
      if (!target.id) target.id = dialog.dataset.triggerId

      const scrollY = window.scrollY

      dialog.showModal()
      requestAnimationFrame(() => window.scrollTo(0, scrollY))
    })
  })

  // 2) Botones que cierran dialogs (dentro del propio dialog).
  const closers = document.querySelectorAll<HTMLElement>('[data-close-dialog]')
  closers.forEach((btn) => {
    if (btn.dataset.dialogBound === '1') return
    btn.dataset.dialogBound = '1'

    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog') as HTMLDialogElement | null
      if (dialog && typeof dialog.close === 'function') {
        dialog.close()
      }
    })
  })

  // 3) Click sobre el backdrop: se detecta porque el target === el dialog.
  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog')
  dialogs.forEach((dialog) => {
    if (dialog.dataset.backdropBound === '1') return
    dialog.dataset.backdropBound = '1'

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close()
      }
    })

    // Restaurar foco al cerrar (cubre backdrop, data-close-dialog y Escape).
    dialog.addEventListener('close', () => {
      const triggerId = dialog.dataset.triggerId
      if (triggerId) {
        const trigger = document.getElementById(triggerId)
        if (trigger && typeof trigger.focus === 'function') {
          trigger.focus({ preventScroll: true })
        }
      }
    })
  })
}

function init(): void {
  // Doble punto de entrada: Astro emite astro:page-load tras cada navegacion
  // con View Transitions; DOMContentLoaded cubre el caso de carga inicial
  // donde astro:page-load podria no dispararse en algunos entornos.
  bind()
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init)
  document.addEventListener('astro:page-load', init)
}

export default init
