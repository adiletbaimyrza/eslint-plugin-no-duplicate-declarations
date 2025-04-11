export const rules = {
  'no-duplicate-declarations': require('./lib/rules/no-duplicate-declarations'),
}
export const configs = {
  recommended: {
    plugins: ['no-duplicate-declarations'],
    rules: {
      'no-duplicate-declarations/no-duplicate-declarations': 'error',
    },
  },
  classesOnly: {
    plugins: ['no-duplicate-declarations'],
    rules: {
      'no-duplicate-declarations/no-duplicate-declarations': [
        'error',
        {
          checkTypes: ['class'],
        },
      ],
    },
  },
  typesInterfaces: {
    plugins: ['no-duplicate-declarations'],
    rules: {
      'no-duplicate-declarations/no-duplicate-declarations': [
        'error',
        {
          checkTypes: ['interface', 'type'],
        },
      ],
    },
  },
}
