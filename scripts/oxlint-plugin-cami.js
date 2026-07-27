import path from 'path'

const ARRAY_MUTATION_METHODS = new Set([
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
  'copyWithin',
  'fill',
])

const FUNCTION_LIKE_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
])

function isFunctionLike(node) {
  return Boolean(node && FUNCTION_LIKE_TYPES.has(node.type))
}

function getPropertyNameText(node) {
  if (!node) return null
  if (node.type === 'Identifier' || node.type === 'PrivateIdentifier') return node.name
  if (node.type === 'Literal') return String(node.value)
  return null
}

function unwrapExpression(node) {
  let current = node
  while (current) {
    if (current.type === 'ChainExpression') {
      current = current.expression
      continue
    }

    if (current.type === 'TSAsExpression' || current.type === 'TSTypeAssertion') {
      current = current.expression
      continue
    }

    if (current.type === 'TSNonNullExpression') {
      current = current.expression
      continue
    }

    if (current.type === 'ParenthesizedExpression') {
      current = current.expression
      continue
    }

    break
  }

  return current
}

function isThisRootedExpression(node) {
  const target = unwrapExpression(node)
  if (!target) return false
  if (target.type === 'ThisExpression') return true
  if (target.type === 'MemberExpression') return isThisRootedExpression(target.object)
  return false
}

function getFirstThisSegment(node) {
  const target = unwrapExpression(node)
  if (!target || target.type !== 'MemberExpression') return null

  const object = unwrapExpression(target.object)
  if (object?.type === 'ThisExpression') {
    if (target.computed) {
      if (target.property?.type === 'Literal') return String(target.property.value)
      return null
    }

    if (target.property?.type === 'PrivateIdentifier') return `#${target.property.name}`
    if (target.property?.type === 'Identifier') return target.property.name
    return null
  }

  return getFirstThisSegment(object)
}

function isThisStateWriteTarget(node) {
  const target = unwrapExpression(node)
  return Boolean(
    target && target.type === 'MemberExpression' && isThisRootedExpression(target.object)
  )
}

function isThisPublicStateWriteTarget(node) {
  const firstSegment = getFirstThisSegment(node)
  if (!firstSegment) return false
  if (firstSegment.startsWith('#') || firstSegment.startsWith('__')) return false
  return isThisStateWriteTarget(node)
}

function getMemberPropertyName(node) {
  const target = unwrapExpression(node)
  if (!target || target.type !== 'MemberExpression') return null
  if (target.computed) {
    if (target.property?.type === 'Literal') return String(target.property.value)
    return null
  }

  return getPropertyNameText(target.property)
}

function traverse(node, visit, { skipNestedFunctions = false, root = node } = {}) {
  const walk = current => {
    if (!current || typeof current.type !== 'string') return

    visit(current)

    if (skipNestedFunctions && current !== root && isFunctionLike(current)) return

    for (const [key, value] of Object.entries(current)) {
      if (key === 'parent') continue

      if (Array.isArray(value)) {
        for (const child of value) walk(child)
      } else if (value && typeof value.type === 'string') {
        walk(value)
      }
    }
  }

  walk(node)
}

function containsThisPropRead(node) {
  let found = false

  traverse(node, current => {
    if (found) return

    const target = unwrapExpression(current)
    if (!target || target.type !== 'MemberExpression') return

    const firstSegment = getFirstThisSegment(target)
    if (!firstSegment) return
    if (firstSegment.startsWith('#') || firstSegment.startsWith('__')) return
    if (!isThisRootedExpression(target.object)) return

    const parent = current.parent
    if (parent?.type === 'CallExpression' && parent.callee === current) return

    found = true
  })

  return found
}

function containsThisPublicWrite(node) {
  let found = false

  traverse(node, current => {
    if (found) return

    if (current.type === 'AssignmentExpression' && isThisPublicStateWriteTarget(current.left)) {
      found = true
      return
    }

    if (current.type === 'UpdateExpression' && isThisPublicStateWriteTarget(current.argument)) {
      found = true
      return
    }

    if (
      current.type === 'UnaryExpression' &&
      current.operator === 'delete' &&
      isThisPublicStateWriteTarget(current.argument)
    ) {
      found = true
      return
    }

    if (current.type === 'CallExpression') {
      const callee = unwrapExpression(current.callee)
      const methodName = getMemberPropertyName(callee)
      if (
        methodName &&
        ARRAY_MUTATION_METHODS.has(methodName) &&
        callee?.type === 'MemberExpression' &&
        isThisPublicStateWriteTarget(callee.object)
      ) {
        found = true
      }
    }
  })

  return found
}

function isReactiveElementClass(node) {
  const superClass = unwrapExpression(node?.superClass)
  if (!superClass) return false
  if (superClass.type === 'Identifier' && superClass.name === 'ReactiveElement') return true
  if (
    superClass.type === 'MemberExpression' &&
    getMemberPropertyName(superClass) === 'ReactiveElement'
  )
    return true
  return false
}

function isTestLikeFile(filePath) {
  return /(?:\.test\.|\.spec\.)[jt]sx?$/i.test(filePath)
}

function reportTemplateViolation(context, node, messageId) {
  context.report({ node, messageId })
}

function inspectTemplateBody(context, body) {
  traverse(
    body,
    node => {
      if (node.type === 'CallExpression') {
        const callee = unwrapExpression(node.callee)

        if (callee?.type === 'MemberExpression') {
          const methodName = getMemberPropertyName(callee)

          if (
            methodName === 'render' &&
            unwrapExpression(callee.object)?.type === 'ThisExpression'
          ) {
            reportTemplateViolation(context, node, 'templateReentrantRenderCall')
          }

          if (methodName === 'dispatch') {
            reportTemplateViolation(context, node, 'templateDispatchInRender')
          }

          if (
            methodName &&
            ARRAY_MUTATION_METHODS.has(methodName) &&
            isThisStateWriteTarget(callee.object)
          ) {
            reportTemplateViolation(context, node, 'templateStateWrite')
          }
        } else if (callee?.type === 'Identifier' && callee.name === 'dispatch') {
          reportTemplateViolation(context, node, 'templateDispatchInRender')
        }
      }

      if (node.type === 'AssignmentExpression' && isThisStateWriteTarget(node.left)) {
        reportTemplateViolation(context, node, 'templateStateWrite')
      }

      if (node.type === 'UpdateExpression' && isThisStateWriteTarget(node.argument)) {
        reportTemplateViolation(context, node, 'templateStateWrite')
      }

      if (
        node.type === 'UnaryExpression' &&
        node.operator === 'delete' &&
        isThisStateWriteTarget(node.argument)
      ) {
        reportTemplateViolation(context, node, 'templateStateWrite')
      }
    },
    { skipNestedFunctions: true, root: body }
  )
}

const filenameConventionRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require kebab-case JS/TS filenames',
    },
    schema: [],
    messages: {
      invalidFilename: 'Filename should use kebab-case (dashes) instead of snake_case or camelCase',
    },
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.filename || context.getFilename?.() || ''
        const fileName = path.basename(filename)
        if (!/\.(js|jsx|ts|tsx)$/i.test(fileName)) return
        if (
          fileName === 'index.ts' ||
          fileName === 'index.js' ||
          fileName === 'stores.ts' ||
          fileName === 'stores.js'
        )
          return

        const baseName = fileName.replace(/\.[^.]+$/, '')
        if (fileName.includes('_') || /[a-z][A-Z]/.test(baseName)) {
          context.report({ node, messageId: 'invalidFilename' })
        }
      },
    }
  },
}

const camiRuleMessages = {
  docsCamiInvariant:
    'Cami invariant from docs/best_practices.md violated. Keep templates pure, prefer afterRender() for DOM work, and avoid reactive guards in connectedCallback().',
  noSingleUnderscoreReactiveField:
    'Cami invariant violation: ReactiveElement fields should use #private fields, __internal fields, or static nonReactiveProperties. Avoid single-underscore reactive fields.',
  noEffect:
    'Cami best-practice violation: do not call effect() in component logic. Use store actions/memos and afterRender() instead.',
  noAfterRenderDeprecated:
    'Cami rule placeholder — afterRender() is the canonical post-commit effect API. This rule is kept for future use.',
  connectedCallbackReactiveGuard:
    'Cami best-practice violation: avoid reactive guards in connectedCallback() that read this.* and write this.*. Move derived state logic into render/getters or a store action.',
  templateReentrantRenderCall:
    'Template purity violation: do not call this.render() inside template(). Move writes/effects into event handlers, actions, or afterRender().',
  templateDispatchInRender:
    'Template purity violation: do not call dispatch() during template render. Move dispatch into event handlers, actions, or afterRender().',
  templateStateWrite:
    'Template purity violation: do not write to this.* during template render. Move writes into event handlers, actions, or afterRender().',
}

const camiRules = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce repo-specific Cami invariants documented in docs/cami.md',
    },
    schema: [],
    messages: camiRuleMessages,
  },
  create(context) {
    const filePath = context.filename || context.getFilename?.() || ''
    if (isTestLikeFile(filePath)) return {}

    const inspectClass = node => {
      if (!isReactiveElementClass(node)) return

      for (const member of node.body.body) {
        if (member.type !== 'MethodDefinition' || !member.value?.body) continue
        const memberName = getPropertyNameText(member.key)
        if (!memberName) continue

        traverse(member.value.body, current => {
          if (current.type !== 'CallExpression') return
          const callee = unwrapExpression(current.callee)

          if (callee?.type === 'Identifier') {
            if (callee.name === 'effect') context.report({ node: current, messageId: 'noEffect' })
            return
          }

          if (callee?.type !== 'MemberExpression') return
          const methodName = getMemberPropertyName(callee)
          if (
            methodName === 'effect' &&
            unwrapExpression(callee.object)?.type === 'ThisExpression'
          ) {
            context.report({ node: current, messageId: 'noEffect' })
          }
        })

        if (memberName === 'connectedCallback') {
          traverse(
            member.value.body,
            current => {
              if (current.type !== 'IfStatement') return
              const conditionReadsThis = containsThisPropRead(current.test)
              const thenWritesThis = containsThisPublicWrite(current.consequent)
              const elseWritesThis = current.alternate
                ? containsThisPublicWrite(current.alternate)
                : false
              if (conditionReadsThis && (thenWritesThis || elseWritesThis)) {
                context.report({ node: current, messageId: 'connectedCallbackReactiveGuard' })
              }
            },
            { skipNestedFunctions: true, root: member.value.body }
          )
        }

        if (memberName === 'template') {
          inspectTemplateBody(context, member.value.body)
        }
      }
    }

    return {
      ClassDeclaration: inspectClass,
      ClassExpression: inspectClass,
    }
  },
}

const camiFieldInvariantsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce ReactiveElement field naming invariants from docs/cami.md for non-reactive/internal fields',
    },
    schema: [],
    messages: {
      noSingleUnderscoreReactiveField: camiRuleMessages.noSingleUnderscoreReactiveField,
    },
  },
  create(context) {
    const inspectClass = node => {
      if (!isReactiveElementClass(node)) return

      for (const member of node.body.body) {
        if (member.type !== 'PropertyDefinition') continue
        if (!member.key || member.computed) continue

        const fieldName = getPropertyNameText(member.key)
        if (!fieldName) continue
        if (!fieldName.startsWith('_')) continue
        if (fieldName.startsWith('__')) continue

        context.report({ node: member, messageId: 'noSingleUnderscoreReactiveField' })
      }
    }

    return {
      ClassDeclaration: inspectClass,
      ClassExpression: inspectClass,
    }
  },
}

const noCurrentColorRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow currentColor in SVG fill/stroke — Safari renders it unreliably; use explicit CSS variables (e.g. var(--primary-11)) instead',
    },
    schema: [],
    messages: {
      noCurrentColor:
        'Avoid currentColor in SVG attributes — Safari has rendering issues. Use an explicit CSS variable (e.g. fill="var(--primary-11)") instead.',
    },
  },
  create(context) {
    const checkForCurrentColor = raw => {
      return typeof raw === 'string' && /currentColor/i.test(raw)
    }

    return {
      Literal(node) {
        if (checkForCurrentColor(node.value)) {
          context.report({ node, messageId: 'noCurrentColor' })
        }
      },
      TemplateElement(node) {
        if (checkForCurrentColor(node.value?.raw)) {
          context.report({ node, messageId: 'noCurrentColor' })
        }
      },
    }
  },
}

export default {
  meta: {
    name: 'cami',
  },
  rules: {
    'filename-convention': filenameConventionRule,
    'cami-rules': camiRules,
    'cami-field-invariants': camiFieldInvariantsRule,
    'no-current-color': noCurrentColorRule,
  },
}
