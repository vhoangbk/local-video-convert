import { defineConfig } from 'eslint/config'
import eslintPlugin from '@eslint/js'
import { configs as tseslintConfigs } from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import nextPlugin from '@next/eslint-plugin-next'
import path from 'path'

const projectRoot = path.resolve()

const ignoresConfig = defineConfig([
  {
    name: 'project/ignores',
    ignores: [
      '.next/',
      'node_modules/',
      'public/',
      '.vscode/',
      'next-env.d.ts',
      '.agents/',
    ]
  },
])

const eslintConfig = defineConfig([
  {
    name: 'project/javascript-recommended',
    files: ['src/**/*.{js,mjs,ts,tsx}'],
    ...eslintPlugin.configs.recommended,
  },
])

const typescriptConfig = defineConfig([
  {
    name: 'project/typescript',
    files: ['src/**/*.{ts,tsx,mjs}'],
    extends: [
      ...tseslintConfigs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: projectRoot,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
])

const reactConfig = defineConfig([
  {
    name: 'project/react-next',
    files: ['src/**/*.{jsx,tsx}'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
])

export default defineConfig([
  ...ignoresConfig,
  ...eslintConfig,
  ...typescriptConfig,
  ...reactConfig,
])
