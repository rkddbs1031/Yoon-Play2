import { FlatCompat } from '@eslint/eslintrc';
import typescript from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'prettier', 'next/typescript', 'plugin:import/recommended'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    plugins: {
      '@typescript-eslint': typescript,
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // TS & React 규칙
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-array-index-key': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],

      // import
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], // 1. React, Next, 외부 라이브러리
            'internal', // 2. 로직 (@/constants, hooks, services, types 등)
            'object', // 3. 컴포넌트 전용 (internal과 상대 경로 사이의 벽!)
            ['parent', 'sibling', 'index'], // 4. 모든 상대 경로 (../ 와 ./ 를 하나로 묶음!)
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/components/**',
              group: 'object',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: [], // 타입 임포트가 섞일 수 있도록 해제
          distinctGroup: false,
          'newlines-between': 'always', // 그룹 사이 한 줄 띄우기
          alphabetize: {
            order: 'asc', // 그룹 내부 알파벳 순
            caseInsensitive: true,
          },
        },
      ],

      // Prettier 연동
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
        },
      ],
    },
  },
];

export default eslintConfig;
