import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: globals.browser,
            ecmaVersion: 'latest',
        },
        rules: {
            'arrow-spacing': ['warn', { before: true, after: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': 'error',
            'comma-style': 'error',
            curly: ['error', 'multi-line', 'consistent'],
            'dot-location': ['error', 'property'],
            'handle-callback-err': 'off',
            indent: ['error', 4],
            'keyword-spacing': 'error',
            'max-nested-callbacks': ['error', { max: 4 }],
            'max-statements-per-line': ['error', { max: 2 }],
            'no-console': 'off',
            'no-empty-function': 'error',
            'no-floating-decimal': 'error',
            'no-lonely-if': 'error',
            'no-multi-spaces': 'error',
            'no-multiple-empty-lines': [
                'error',
                { max: 2, maxEOF: 1, maxBOF: 0 },
            ],
            'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
            'no-trailing-spaces': ['error'],
            'no-var': 'error',
            'no-undef': 'error',
            'object-curly-spacing': ['error', 'always'],
            'prefer-const': 'error',
            semi: ['error', 'always'],
            'space-before-blocks': 'error',
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'spaced-comment': 'error',
            yoda: 'error',
            'import/first': 'off',
        },
    },
];
