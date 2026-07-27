const RENDER_PHASE_DEPTH_KEY = Symbol.for('__cami_render_phase_depth__')
const RENDER_PHASE_TAG_STACK_KEY = Symbol.for('__cami_render_phase_tag_stack__')

type GlobalRenderPhase = typeof globalThis & {
  [RENDER_PHASE_DEPTH_KEY]?: number
  [RENDER_PHASE_TAG_STACK_KEY]?: string[]
}

const readDepth = (): number => {
  const globalRef = globalThis as GlobalRenderPhase
  return Number(globalRef[RENDER_PHASE_DEPTH_KEY] || 0)
}

const readTagStack = (): string[] => {
  const globalRef = globalThis as GlobalRenderPhase
  const stack = globalRef[RENDER_PHASE_TAG_STACK_KEY]
  if (Array.isArray(stack)) return stack
  const next: string[] = []
  globalRef[RENDER_PHASE_TAG_STACK_KEY] = next
  return next
}

export const enterRenderPhase = (tagName: string): void => {
  const globalRef = globalThis as GlobalRenderPhase
  const nextDepth = readDepth() + 1
  globalRef[RENDER_PHASE_DEPTH_KEY] = nextDepth
  readTagStack().push(
    String(tagName || '')
      .trim()
      .toLowerCase() || 'unknown'
  )
}

export const exitRenderPhase = (): void => {
  const globalRef = globalThis as GlobalRenderPhase
  const stack = readTagStack()
  if (stack.length > 0) {
    stack.pop()
  }

  const currentDepth = readDepth()
  const nextDepth = Math.max(0, currentDepth - 1)
  globalRef[RENDER_PHASE_DEPTH_KEY] = nextDepth
}

export const getRenderPhaseContext = (): {
  inRenderPhase: boolean
  depth: number
  activeElementTagName: string | null
} => {
  const depth = readDepth()
  const stack = readTagStack()
  const activeElementTagName = stack.length > 0 ? stack[stack.length - 1] || null : null

  return {
    inRenderPhase: depth > 0,
    depth,
    activeElementTagName,
  }
}
