import { beforeEach, describe, expect, it, vi } from 'vitest'

const { URLStore } = cami

const settleNavigation = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('URLStore public navigation contract', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#home')
    document.body.innerHTML = '<div id="liveRegion" aria-live="polite"></div>'
  })

  it('cancels navigation only when a beforeNavigate hook returns false', async () => {
    const router = new URLStore()
    router.registerRoute('home').registerRoute('admin')
    await router.initialize()

    const entered = vi.fn()
    router.registerRoute('admin', { onEnter: entered })
    router.beforeNavigate(({ to }) => (to.hashPaths[0] === 'admin' ? false : undefined))

    router.navigate({ path: 'admin' })
    await settleNavigation()

    expect(router.getState().hashPaths).toEqual(['home'])
    expect(window.location.hash).toBe('#home')
    expect(entered).not.toHaveBeenCalled()
  })

  it('passes the previous and next states to leave and after hooks', async () => {
    const router = new URLStore()
    const onLeave = vi.fn()
    const afterNavigate = vi.fn()

    router.registerRoute('home', { onLeave }).registerRoute('posts/:id')
    router.afterNavigate(afterNavigate)
    await router.initialize()
    afterNavigate.mockClear()

    router.navigate({ path: 'posts/42' })
    await settleNavigation()

    expect(onLeave).toHaveBeenCalledWith({
      from: { params: {}, hashPaths: ['home'], hashParams: {} },
      to: {
        params: {},
        hashPaths: ['posts', '42'],
        hashParams: {},
        routeParams: { id: '42' },
      },
    })
    expect(afterNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        from: { params: {}, hashPaths: ['home'], hashParams: {} },
        to: expect.objectContaining({ routeParams: { id: '42' } }),
      })
    )
  })

  it('exposes active-route and pending navigation state', async () => {
    const router = new URLStore()
    let releaseLoader
    router.registerRoute('posts/:id', { resources: ['post'] })
    router.registerResourceLoader(
      'post',
      () =>
        new Promise(resolve => {
          releaseLoader = resolve
        })
    )
    await router.initialize()

    router.navigate({ path: 'posts/7' })
    await Promise.resolve()

    expect(router.isPending()).toBe(true)
    releaseLoader()
    await settleNavigation()

    expect(router.isPending()).toBe(false)
    expect(router.getActiveRoute()).toEqual(
      expect.objectContaining({ pattern: 'posts/:id', extractedParams: { id: '7' } })
    )
  })

  it('supports shallow query updates without re-entering the route', async () => {
    const router = new URLStore()
    const onEnter = vi.fn()
    router.registerRoute('posts/:id', { onEnter })
    await router.initialize()
    onEnter.mockClear()

    router.navigate({ params: { tab: 'comments' }, shallow: true, replace: true })

    expect(router.getState()).toEqual({
      params: { tab: 'comments' },
      hashPaths: ['home'],
      hashParams: {},
    })
    expect(onEnter).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('#home?tab=comments')
  })

  it('preserves configured query parameters during a full replacement', async () => {
    const router = new URLStore()
    router.registerRoute('posts/:id', {
      params: {
        workspace: { persist: true },
        panel: { persist: false },
      },
    })
    await router.initialize()

    router.navigate({ params: { workspace: 'alpha', panel: 'details' }, shallow: true })
    router.navigate({ path: 'posts/42', params: { page: '2' }, fullReplace: true })
    await settleNavigation()

    expect(router.getState()).toEqual({
      params: { workspace: 'alpha', page: '2' },
      hashPaths: ['posts', '42'],
      hashParams: {},
      routeParams: { id: '42' },
    })
  })

  it('rejects path, hash parameter, and full replacement changes in shallow mode', () => {
    const router = new URLStore()

    expect(() => router.navigate({ path: 'posts', shallow: true })).toThrow(
      /cannot change the path/
    )
    expect(() => router.navigate({ hashParams: { panel: 'info' }, shallow: true })).toThrow(
      /cannot modify hashParams/
    )
    expect(() => router.navigate({ fullReplace: true, shallow: true })).toThrow(
      /cannot use fullReplace/
    )
  })
})
