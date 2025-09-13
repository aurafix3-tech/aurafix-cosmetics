module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Disable unused variables warning for build
    'no-unused-vars': 'warn',
    // Allow unused imports during development
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  }
};
