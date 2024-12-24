module.exports = {
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/naming-convention': 'off',
                '@typescript-eslint/no-extraneous-class': 'off',
                'no-template-curly-in-string': 'off',
            },
            extends: 'love'
        }
    ],
    ignorePatterns: [
        'jest.config.ts',
        '.eslintrc.js',
        'babel.config.js',
        'node_modules/',
        'tests/',
        '@types/**',
        '*CommandDecorator.ts'
    ],
}