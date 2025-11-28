/**
 * ESLint 9 配置 - NestJS企业级规范
 * 基于TypeScript严格模式，强调代码质量和一致性
 */
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  // 忽略的文件
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '.eslintrc.js'],
  },

  // 基础配置
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // ==================== ESLint推荐规则 ====================
      ...eslint.configs.recommended.rules,

      // ==================== TypeScript推荐规则 ====================
      ...tseslint.configs.recommended.rules,

      // ==================== Prettier集成 ====================
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // ==================== TypeScript规则 ====================
      // 未使用变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // any类型控制
      '@typescript-eslint/no-explicit-any': 'warn',

      // 函数返回类型（NestJS Controller可以省略）
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 类型导入
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // 优先使用interface
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Promise处理
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // 禁止非空断言
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // 命名规范
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false, // 不使用I前缀
          },
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],

      // 其他TS规则
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/default-param-last': 'error',

      // ==================== Import规则 ====================
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: '@nestjs/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@config/**',
              group: 'internal',
            },
            {
              pattern: '@common/**',
              group: 'internal',
            },
            {
              pattern: '@modules/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['@nestjs/**'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off',
      'no-duplicate-imports': 'error',

      // ==================== 代码质量规则 ====================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      eqeqeq: ['error', 'always'],
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-lonely-if': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-throw-literal': 'error',
      'no-constant-condition': 'error',
      yoda: 'error',
      'prefer-promise-reject-errors': 'error',
      radix: 'error',

      // 魔法数字（放宽限制）
      'no-magic-numbers': 'off',

      // ==================== 代码风格规则 ====================
      'quote-props': ['error', 'as-needed'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // 单行长度由Prettier的printWidth控制
      'max-len': 'off',

      // 文件行数限制（企业级规范：200行）
      'max-lines': [
        'warn',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      'max-params': ['warn', 5],
      complexity: ['warn', 15],

      // ==================== 注释规范 ====================
      'spaced-comment': ['error', 'always', { markers: ['/'] }],

      // ==================== 函数规范 ====================
      'no-param-reassign': ['error', { props: false }],

      // ==================== 变量声明规范 ====================
      'one-var': ['error', 'never'],
      'no-multi-assign': 'error',

      // ==================== 覆盖默认规则 ====================
      'no-useless-constructor': 'off',
      'no-shadow': 'off',
      'no-return-await': 'off',
      'no-unused-expressions': 'off',
      'require-await': 'off',
      'default-param-last': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
  },
];
