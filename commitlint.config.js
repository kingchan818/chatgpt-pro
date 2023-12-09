module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-case': [2, 'always', 'upper-case'],
      'type-enum': [
        2,
        'always',
        [
          'BUILD',
          'CHORE',
          'CI',
          'DOCS',
          'FEAT',
          'FIX',
          'PERF',
          'REFACTOR',
          'REVERT',
          'STYLE',
          'TEST',
        ],
      ],
      'subject-case': [2, 'always', 'sentence-case'],
    },
  };