import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // NotificationContext.jsx exporta el proveedor y sus hooks juntos (ejercicio 6.22)
      'react-refresh/only-export-components': [
        'error',
        { allowExportNames: ['useNotify', 'useNotificationValue'] },
      ],
    },
  },
  {
    // el servidor de pruebas se ejecuta con Node, no en el navegador
    files: ['server.js'],
    languageOptions: { globals: globals.node },
  },
])
