module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
    'vue/attribute-hyphenation': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
