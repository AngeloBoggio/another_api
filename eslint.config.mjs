import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  // Ignore generated and dependency files
  {
    ignores: ['node_modules/**', 'generated/**', 'dist/**', 'public/**'],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules across all TS/TSX files
  ...tseslint.configs.recommended,

  // React hooks rules (frontend only)
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
);
