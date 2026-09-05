(() => {
  const GATE_CLASS = 'cover-gate'
  const SCROLL_KEYS = new Set([
    'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Space'
  ])

  let locked = false
  let enterBtn = null

  const onWheelOrTouch = e => {
    if (locked) e.preventDefault()
  }

  const onKeydown = e => {
    if (!locked) return
    if (SCROLL_KEYS.has(e.key) || SCROLL_KEYS.has(e.code)) e.preventDefault()
  }

  const isHomeGate = () => {
    const header = document.getElementById('page-header')
    return !!(header && header.classList.contains('full_page') && document.getElementById('scroll-down'))
  }

  const unlock = () => {
    if (!locked && !document.body.classList.contains(GATE_CLASS)) return
    locked = false
    document.body.classList.remove(GATE_CLASS)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    window.removeEventListener('wheel', onWheelOrTouch)
    window.removeEventListener('touchmove', onWheelOrTouch)
    window.removeEventListener('keydown', onKeydown)
  }

  const lock = () => {
    if (locked) return
    locked = true
    document.body.classList.add(GATE_CLASS)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    window.addEventListener('wheel', onWheelOrTouch, { passive: false })
    window.addEventListener('touchmove', onWheelOrTouch, { passive: false })
    window.addEventListener('keydown', onKeydown, { passive: false })
  }

  const onEnterClick = () => {
    unlock()
  }

  const bindEnterBtn = () => {
    if (enterBtn) {
      enterBtn.removeEventListener('click', onEnterClick, true)
      enterBtn = null
    }
    const btn = document.getElementById('scroll-down')
    if (!btn) return
    enterBtn = btn
    // 捕获阶段先解锁，保证主题自带的滚动进入能生效
    enterBtn.addEventListener('click', onEnterClick, true)
  }

  const init = () => {
    unlock()
    if (!isHomeGate()) return
    lock()
    bindEnterBtn()
  }

  document.addEventListener('DOMContentLoaded', init)
  document.addEventListener('pjax:complete', init)
  document.addEventListener('pjax:send', unlock)
})()
