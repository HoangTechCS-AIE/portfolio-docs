import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/ai-chag/overview">
                        Explore Projects →
                    </Link>
                </div>
            </div>
        </header>
    );
}

function ProjectCard({ title, description, techStack, link, highlights }) {
    return (
        <div className="col col--12 margin-bottom--lg">
            <div className="project-card">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="margin-bottom--md">
                    {techStack.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                    ))}
                </div>
                <ul>
                    {highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                    ))}
                </ul>
                <Link className="button button--primary button--md" to={link}>
                    View Details →
                </Link>
            </div>
        </div>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Welcome to ${siteConfig.title}`}
            description="Portfolio showcasing open-source projects with AI/ML, IoT, and data platform solutions">
            <HomepageHeader />
            <main>
                <section className="container margin-vert--xl">
                    <div className="row">
                        <div className="col text--center margin-bottom--lg">
                            <h2>Featured Projects</h2>
                            <p>Dự án nguồn mở sử dụng AI/ML, IoT, và nền tảng dữ liệu</p>
                        </div>
                    </div>
                    <div className="row">
                        <ProjectCard
                            title="🎬 AI-Chag 2025"
                            description="AI-powered Video Retrieval System - Hệ thống tìm kiếm video thông minh sử dụng CLIP model và Vector Database"
                            techStack={['Python', 'FastAPI', 'CLIP AI', 'Qdrant', 'React']}
                            highlights={[
                                '🤖 Multimodal AI: CLIP model cho semantic search',
                                '🔍 Vector Database: Qdrant với HNSW algorithm',
                                '⚡ Fast Retrieval: <100ms search latency',
                                '🏗️ Clean Architecture: Domain-driven design'
                            ]}
                            link="/docs/ai-chag/overview"
                        />

                        <ProjectCard
                            title="📊 Ldx-Insight"
                            description="Open Data Integration Platform - Nền tảng tích hợp dữ liệu mở với Machine Learning diagnostic"
                            techStack={['Spring Boot', 'MongoDB', 'Nuxt.js', 'Python ML']}
                            highlights={[
                                '🔗 Data Integration: Thu thập từ nhiều nguồn mở Việt Nam',
                                '🧠 ML Diagnostic: Python ML service phân tích chỉ số',
                                '🌐 Modern Stack: Spring Boot 3 + Vue.js 3',
                                '📈 Dashboard: Visualization với biểu đồ trực quan'
                            ]}
                            link="/docs/ldx-insight/overview"
                        />

                        <ProjectCard
                            title="🏙️ SmartCity Platform"
                            description="Smart Urban Data Platform - Nền tảng IoT với Tiered Storage và ML Classification tự động"
                            techStack={['Spring Boot', 'RabbitMQ', 'Redis', 'MongoDB', 'FastAPI']}
                            highlights={[
                                '🤖 ML Classification: IsolationForest phân loại HOT/WARM/COLD',
                                '💾 Tiered Storage: Redis + MongoDB multi-datasource',
                                '📡 IoT Scale: Handle 40M+ messages',
                                '🔄 Pull Architecture: Resilient & scalable design'
                            ]}
                            link="/docs/smartcity/overview"
                        />
                    </div>
                </section>

                <section className="container margin-vert--xl">
                    <div className="row">
                        <div className="col text--center">
                            <h2>Technology Expertise</h2>
                            <p className="margin-bottom--lg">Công nghệ sử dụng trong các dự án</p>
                            <div>
                                <span className="tech-badge">Python</span>
                                <span className="tech-badge">Java / Spring Boot</span>
                                <span className="tech-badge">FastAPI</span>
                                <span className="tech-badge">Machine Learning</span>
                                <span className="tech-badge">CLIP AI</span>
                                <span className="tech-badge">Vector Database</span>
                                <span className="tech-badge">Redis</span>
                                <span className="tech-badge">MongoDB</span>
                                <span className="tech-badge">RabbitMQ</span>
                                <span className="tech-badge">React / Vue.js</span>
                                <span className="tech-badge">Docker</span>
                                <span className="tech-badge">Clean Architecture</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
