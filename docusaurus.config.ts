import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// GitHub pages deployment config.
// ToDo: 最初に編集する必要がある箇所
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
  // favicon: 'img/favicon.ico',
  favicon: 'img/logo.ico',

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
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'api-spec',
            spec: 'openapi/openapi-single.yaml',
            route: '/api/',
          },
        ],
        theme: {
          primaryColor: '#1976d2',
        },
      },
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
        {
          label: 'API',
          position: 'left',
          to: '/api/',
        },
        {
          href: 'https://github.com/plenarc/create-specment',
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
              label: 'Slack (Sample)',
              href: 'https://slack.com/intl/ja-jp',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/plenarc/create-specment/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Changelog',
              href: 'https://github.com/plenarc/create-specment/blob/main/CHANGELOG.md',
            },
            {
              label: 'GitHub: Create Specment',
              href: 'https://github.com/plenarc/create-specment',
            },
            {
              label: 'Docusaurus',
              href: 'https://docusaurus.io/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${titleValue}, Inc. Built with Create Specment.`,
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
