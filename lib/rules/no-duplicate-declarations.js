/**
 * @fileoverview Rule to detect duplicate declaration names across files
 */
'use strict'

const declarationRegistry = new Map()
const declarationLocations = new Map()

const resetRegistry = () => {
  declarationRegistry.clear()
  declarationLocations.clear()
}

const ALL_DECLARATION_TYPES = [
  'class',
  'interface',
  'type',
  'enum',
  'function',
  'variable',
  'namespace',
  'module',
]

export const meta = {
  type: 'suggestion',
  docs: {
    description: 'Detect duplicate declaration names across the entire project',
    category: 'Possible Errors',
    recommended: true,
  },
  fixable: null,
  schema: [
    {
      type: 'object',
      properties: {
        checkTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ALL_DECLARATION_TYPES,
          },
        },
        ignoreTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ALL_DECLARATION_TYPES,
          },
        },
      },
      additionalProperties: false,
    },
  ],
}
export function create(context) {
  const filename = context.getFilename()
  const options = context.options[0] || {}

  let typesToCheck
  if (options.checkTypes && options.checkTypes.length > 0) {
    typesToCheck = new Set(options.checkTypes)
  } else if (options.ignoreTypes && options.ignoreTypes.length > 0) {
    typesToCheck = new Set(ALL_DECLARATION_TYPES)
    options.ignoreTypes.forEach((type) => typesToCheck.delete(type))
  } else {
    typesToCheck = new Set(ALL_DECLARATION_TYPES)
  }

  function checkAndRegisterDeclaration(node, name, scope) {
    if (!name || !typesToCheck.has(scope)) return

    if (declarationRegistry.has(name)) {
      const existingLocation = declarationLocations.get(name)
      context.report({
        node: node.id || node,
        message: `Duplicate ${scope} name '${name}' also defined in ${existingLocation.filename} at line ${existingLocation.line}`,
      })
    } else {
      declarationRegistry.set(name, true)
      declarationLocations.set(name, {
        filename,
        line: node.loc.start.line,
      })
    }
  }

  return {
    Program: {
      enter() {
        if (declarationRegistry.size === 0) {
          process.on('exit', resetRegistry)
        }
      },
    },

    ClassDeclaration(node) {
      checkAndRegisterDeclaration(node, node.id.name, 'class')
    },

    ClassExpression(node) {
      if (node.id) {
        checkAndRegisterDeclaration(node, node.id.name, 'class')
      }
    },

    FunctionDeclaration(node) {
      if (node.id) {
        checkAndRegisterDeclaration(node, node.id.name, 'function')
      }
    },

    VariableDeclarator(node) {
      if (node.id && node.id.type === 'Identifier') {
        checkAndRegisterDeclaration(node, node.id.name, 'variable')
      }
    },

    TSInterfaceDeclaration(node) {
      checkAndRegisterDeclaration(node, node.id.name, 'interface')
    },

    TSTypeAliasDeclaration(node) {
      checkAndRegisterDeclaration(node, node.id.name, 'type')
    },

    TSEnumDeclaration(node) {
      checkAndRegisterDeclaration(node, node.id.name, 'enum')
    },

    TSModuleDeclaration(node) {
      if (node.id && node.id.type === 'Identifier') {
        const scope = node.declare ? 'module' : 'namespace'
        checkAndRegisterDeclaration(node, node.id.name, scope)
      }
    },

    TSAbstractClassDeclaration(node) {
      checkAndRegisterDeclaration(node, node.id.name, 'class')
    },

    TSDeclareFunction(node) {
      if (node.id) {
        checkAndRegisterDeclaration(node, node.id.name, 'function')
      }
    },

    ExportNamedDeclaration(node) {
      // We don't need to check anything here as the individual declarations
      // will be visited by their respective visitor methods
    },

    ExportSpecifier(node) {
      if (
        node.exported &&
        node.exported.type === 'Identifier' &&
        node.local &&
        node.local.type === 'Identifier' &&
        node.exported.name !== node.local.name
      ) {
        checkAndRegisterDeclaration(node, node.exported.name, 'variable')
      }
    },
  }
}
