(() => {
  // ===========================================================
  // 1. 让首页 / 标签页 / 分类页等文章卡片整张可点击
  // ===========================================================
  const SEL = '.recent-post-item'

  const findLink = (card) => {
    const a = card.querySelector('a.article-title[href]')
    if (a) return a.getAttribute('href')
    const fallback = card.querySelector('a[href]')
    return fallback ? fallback.getAttribute('href') : null
  }

  const bindCard = () => {
    document.querySelectorAll(SEL).forEach(card => {
      if (card.dataset.clickable === '1') return
      const href = findLink(card)
      if (!href) return
      card.dataset.clickable = '1'
      card.style.cursor = 'pointer'

      const go = (e) => {
        const target = e.target.closest('a')
        if (target && card.contains(target)) return
        if (e.target.closest('button, input, textarea, select')) return
        e.preventDefault()
        window.location.href = href
      }

      card.addEventListener('click', go)

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

  // ===========================================================
  // 2. 分页 / 上下篇 切换时滚到页面顶部
  //    - #page-header 顶部导航栏是 fixed,跳转到 #content-inner
  //      实际只滚到页面中部,看起来像没动。
  //    - 解决:点击分页 / 上下篇链接前,先 scrollTo(0, 0);
  //           新页面加载时如果 hash 是 #content-inner,也滚到顶部。
  // ===========================================================
  const bindPagination = () => {
    const links = document.querySelectorAll(
      '#pagination a, .pagination-related[href]'
    )
    if (!links.length) return

    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    links.forEach(a => {
      a.addEventListener('click', () => {
        // 先把滚动位置清掉,避免浏览器在跳转后短暂保留旧位置
        scrollTop()
        // 立即清掉 URL 里的 #content-inner,避免浏览器滚动到旧锚点
        try {
          history.replaceState(null, '', a.getAttribute('href').split('#')[0])
        } catch (e) {}
      }, { passive: true })
    })

    // 新页面加载时:如果之前跳走了,这里再做一次兜底
    if (window.location.hash === '#content-inner') {
      scrollTop()
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      } catch (e) {}
    }
  }

  const init = () => {
    bindCard()
    bindPagination()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  document.addEventListener('pjax:complete', init)
})()
