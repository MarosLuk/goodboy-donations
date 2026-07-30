/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // lodash kebabCase turns i18n into i-18-n, so a scope with a digit could
    // never pass on kebab-case alone.
    'scope-case': [2, 'always', ['kebab-case', 'lower-case']],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 72],
  },
};

export default config;
