import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

function DocumentSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.documentSection}>
      <div className="container">
        <Heading as="h2">このサイトについて</Heading>
        <p>
          このサイトは{siteConfig.title}の設計、仕様を管理するためのドキュメントサイトです。<br/>
          システムの要件定義から詳細設計まで、プロジェクトに関する技術文書を体系的に管理しています。
        </p>

        <div className="row">
          <div className="col col--4">
            <div className={styles.featureCard}>
              <Heading as="h3">ドキュメント構成</Heading>
              <ul>
                <li><Link to="/docs/overview">プロジェクト概要・分析</Link></li>
                <li><Link to="/docs/requirements">要件定義</Link></li>
                <li><Link to="/docs/external">外部設計</Link></li>
                <li><Link to="/docs/internal">内部設計</Link></li>
              </ul>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <Heading as="h3">編集ガイド</Heading>
              <ul>
                <li><Link to="/docs/internal/rules/markdown">Markdownの書き方</Link></li>
                <li><Link to="/docs/internal/rules/document-creation-rules">ドキュメント作成ルール</Link></li>
                <li><Link to="/docs/internal/rules/review-process">レビュープロセス</Link></li>
              </ul>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <Heading as="h3">運用ポリシー</Heading>
              <ul>
                <li><Link to="/docs/internal/policies/github">GitHubの利用方法</Link></li>
                <li><Link to="/docs/internal/policies/pull-request-operation-flow">pull request運用フロー</Link></li>
                <li><Link to="/docs/internal/policies/branch-naming-rules">branch命名規約</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="システム仕様書管理サイト">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <DocumentSection />
      </main>
    </Layout>
  );
}
