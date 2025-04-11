# eslint-plugin-no-duplicate-declarations

ESLint plugin to detect duplicate declaration names across files in your TypeScript/JavaScript projects.

## Installation

```bash
npm install eslint-plugin-no-duplicate-declarations --save-dev
```

## Usage

Add to your `eslint.config.mjs`:

```js
import { defineConfig } from 'eslint/config'
import noDuplicateDeclarations from 'eslint-plugin-no-duplicate-declarations'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  {
    plugins: {
      'no-duplicate-declarations': noDuplicateDeclarations,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'no-duplicate-declarations/no-duplicate-declarations': 'error',
    },
  },
])
```

## Configuration Options

You can configure which declaration types to check:

### Check Only Specific Types

```js
"no-duplicate-declarations/no-duplicate-declarations": ["error", {
  checkTypes: ["class", "interface", "type"]
}]
```

### Ignore Specific Types

```js
"no-duplicate-declarations/no-duplicate-declarations": ["error", {
  ignoreTypes: ["variable", "function"]
}]
```

### Available Declaration Types

- `class`: Class declarations and expressions
- `interface`: TypeScript interfaces
- `type`: TypeScript type aliases
- `enum`: TypeScript enums
- `function`: Function declarations
- `variable`: Variable declarations (const, let, var)
- `namespace`: TypeScript namespaces
- `module`: TypeScript modules

## Preset Configurations

This plugin includes some preset configurations:

### Default (All Types)

```js
{
  extends: ["plugin:no-duplicate-declarations/recommended"]
}
```

### Classes Only

```js
{
  extends: ["plugin:no-duplicate-declarations/classesOnly"]
}
```

### Types and Interfaces Only

```js
{
  extends: ["plugin:no-duplicate-declarations/typesInterfaces"]
}
```

## Example

```typescript
// file1.ts
interface User {
  /* ... */
}

// file2.ts
interface User {
  /* ... */
} // Error: Duplicate interface name 'User' also defined in file1.ts at line 1
```

## License

MIT
