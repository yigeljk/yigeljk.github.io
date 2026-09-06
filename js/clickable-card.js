(() => {
  // 让首页 / 标签页 / 分类页等文章卡片整张可点击
  const SEL = '.recent-post-item'

  const findLink = (card) => {
    // 优先取卡片里 .article-title(hexo 默认就是这个)的 href
    const a = card.querySelector('a.article-title[href]')
    if (a) return a.getAttribute('href')
    const fallback = card.querySelector('a[href]')
    return fallback ? fallback.getAttribute('href') : null
  }

  const bind = () => {
    document.querySelectorAll(SEL).forEach(card => {
      if (card.dataset.clickable === '1') return
      const href = findLink(card)
      if (!href) return
      card.dataset.clickable = '1'
      card.style.cursor = 'pointer'

      const go = (e) => {
        // 如果点的是卡片内部的真链接(分类 / 标签),让链接自己工作
        const target = e.target.closest('a')
        if (target && card.contains(target)) {
          return
        }
        // 不拦截其它元素(按钮、输入框等)
        if (e.target.closest('button, input, textarea, select')) return
        e.preventDefault()
        window.location.href = href
      }

      // 鼠标中键 / a 标签之外的点击都走这里
      card.addEventListener('click', go)

      // 键盘可达性:卡片加 role=link + tabindex
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0')
        card.setAttribute('role', 'link')
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const t = e.target.closest('a')
            if (t && card.contains(t)) return
            e.preventDefault()
            window.location.href = href
          }
        })
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind)
  } else {
    bind()
  }
  document.addEventListener('pjax:complete', bind)
})()
