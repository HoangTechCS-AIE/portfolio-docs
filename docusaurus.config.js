// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Portfolio Projects',
    tagline: 'Showcase of Open Source Projects - Haui-HIT-H2K Team',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://HoangTechCS-AIE.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    organizationName: 'HoangTechCS-AIE', // Usually your GitHub org/user name.
    projectName: 'portfolio-docs', // Usually your repo name.

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'vi',
        locales: ['vi', 'en'],
    },

    markdown: {
        mermaid: true,
    },

    themes: ['@docusaurus/theme-mermaid'],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/your-username/portfolio-docs/tree/main/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'Portfolio',
                logo: {
                    alt: 'Portfolio Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'aiChagSidebar',
                        position: 'left',
                        label: 'AI-Chag 2025',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'ldxInsightSidebar',
                        position: 'left',
                        label: 'Ldx-Insight',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'smartcitySidebar',
                        position: 'left',
                        label: 'SmartCity',
                    },
                    {
                        to: '/about',
                        label: 'About',
                        position: 'right',
                    },
                    {
                        href: 'https://github.com/Haui-HIT-H2K',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Projects',
                        items: [
                            {
                                label: 'AI-Chag 2025',
                                to: '/docs/ai-chag/overview',
                            },
                            {
                                label: 'Ldx-Insight',
                                to: '/docs/ldx-insight/overview',
                            },
                            {
                                label: 'SmartCity Platform',
                                to: '/docs/smartcity/overview',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub - AI-Chag',
                                href: 'https://github.com/hungkernel/ai-chag-2025',
                            },
                            {
                                label: 'GitHub - Ldx-Insight',
                                href: 'https://github.com/Haui-HIT-H2K/Ldx-Insight',
                            },
                            {
                                label: 'GitHub - SmartCity',
                                href: 'https://github.com/Haui-HIT-H2K/SmartCity-Platform',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Portfolio Projects. Built with Docusaurus.`,
            },
            prism: {
                theme: lightTheme,
                darkTheme: darkTheme,
                additionalLanguages: ['java', 'python', 'bash', 'json', 'yaml'],
            },
            mermaid: {
                theme: { light: 'neutral', dark: 'dark' },
            },
        }),
};

module.exports = config;
