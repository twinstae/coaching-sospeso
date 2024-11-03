import reactCompiler from 'eslint-plugin-react-compiler'
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
    ...eslintPluginAstro.configs.all,
    {
        rules: {
            // override/add rules settings here, such as:
            // "astro/no-set-html-directive": "error"
            "astro/sort-attributes": "off"
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