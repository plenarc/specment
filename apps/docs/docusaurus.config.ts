import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// GitHub pages deployment config.
// ToDo: The first part that needs to be edited.
const titleValue = 'プロジェクト名';
const descriptionValue = 'プロジェクト概要。xxxのためのシステムです';
const organizationValue = 'plenarc';
const projectValue = 'specment';
const urlValue = `https://${organizationValue}.github.io`;
const baseUrlValue = `/${projectValue}/`;

// ToDo: Since I don't think GitHub Pages will be used in actual operation, this area needs to be edited according to the environment.
// ToDo: 実運用時にGitHub Pagesは使わないと思うので、この辺りは環境に合わせて要編集する
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const config: Config = {
  title: titleValue,
  tagline: descriptionValue,
  favicon: 'img/favicon.ico',

  url: isGithubActions ? urlValue : 'http://localhost:3000',
  baseUrl: isGithubActions ? baseUrlValue : '/',

  organizationName: organizationValue,
  projectName: projectValue,
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.png',
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: titleValue,
      logo: {
        alt: titleValue,
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'プロジェクト概要・分析',
          type: 'doc',
          position: 'left',
          docId: 'overview/index',
        },
        {
          label: '要件定義',
          type: 'doc',
          position: 'left',
          docId: 'requirements/index',
        },
        {
          label: '外部設計',
          type: 'doc',
          position: 'left',
          docId: 'external/index',
        },
        {
          label: '内部設計',
          type: 'doc',
          position: 'left',
          docId: 'internal/index',
        },
        // {
        //   label: 'API',
        //   position: 'left',
        //   to: '/api/',
        //   // items: [
        //   //   {
        //   //     label: 'redoc example',
        //   //     to: '/api/redoc-example/',
        //   //   },
        //   // ]
        // },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${titleValue}, Inc. Built with Specment.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      {
        // blogRouteBasePath: '/',
        language: ['jp'],
        hashed: true,
        // blogDir: '/blog',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    require.resolve('docusaurus-theme-plantuml'),
  ],
};

export default config;