/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // AI-Chag 2025 sidebar
    aiChagSidebar: [
        'ai-chag/overview',
        'ai-chag/architecture',
        'ai-chag/ai-components',
        'ai-chag/tech-stack',
    ],

    // Ldx-Insight sidebar
    ldxInsightSidebar: [
        'ldx-insight/overview',
        'ldx-insight/architecture',
        'ldx-insight/tech-stack',
        'ldx-insight/features',
    ],

    // SmartCity Platform sidebar
    smartcitySidebar: [
        'smartcity/overview',
        'smartcity/architecture',
        'smartcity/ml-classification',
        'smartcity/tech-stack',
    ],
};

module.exports = sidebars;
