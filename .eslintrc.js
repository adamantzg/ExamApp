module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
      project: ['./tsconfig.json', './tsconfig-aot.json'],
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any' : 'off',
    '@typescript-eslint/explicit-function-return-type' : 'off'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
	  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
};