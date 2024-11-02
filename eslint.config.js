import reactCompiler from 'eslint-plugin-react-compiler'
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
    ...eslintPluginAstro.configs.all,
    {
        rules: {
            // override/add rules settings here, such as:
            // "astro/no-set-html-directive": "error"
        }
    },
    {
        plugins: {
            'react-compiler': reactCompiler,
        },
        rules: {
            'react-compiler/react-compiler': 'error',
        },
    },
];