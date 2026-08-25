import * as vscode from "vscode";

export function showDashboard(project: any) {
    const panel = vscode.window.createWebviewPanel(
        "quicklyzerDashboard",
        "Quicklyzer",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getHtml(project, panel.webview, context.extensionUri);
}

function getHtml(project: any, webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const score = project.projectScore.score;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">

<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src 'unsafe-inline';"
>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Quicklyzer</title>

<style>

* {
    box-sizing: border-box;
}

body {
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
}

h1 {
    margin-bottom: 4px;
}

.subtitle {
    opacity: 0.7;
    margin-bottom: 24px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.card {
    border: 1px solid var(--vscode-panel-border);
    border-radius: 8px;
    padding: 18px;
    background: var(--vscode-editorWidget-background);
}

.card h3 {
    margin-top: 0;
    font-size: 14px;
    opacity: 0.8;
}

.score {
    font-size: 30px;
    font-weight: 700;
}

.rating {
    opacity: 0.7;
}

.section {
    margin-top: 24px;
}

.section h2 {
    font-size: 16px;
    border-bottom: 1px solid var(--vscode-panel-border);
    padding-bottom: 8px;
}

.summary {
    line-height: 1.6;
}

ul {
    padding-left: 20px;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.main-score {
    text-align: right;
}

.main-score .score {
    font-size: 42px;
}

@media (max-width: 800px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .project-header {
        display: block;
    }

    .main-score {
        text-align: left;
        margin-top: 15px;
    }
}

</style>
</head>

<body>

<div class="project-header">

<div>
    <h1>QUICKLYZER</h1>
    <div class="subtitle">
        ${escapeHtml(project.name)}
    </div>
</div>

<div class="main-score">
    <div class="score">${score}/100</div>
    <div class="rating">
        ${escapeHtml(project.projectScore.rating)}
    </div>
</div>

</div>

<div class="grid">

${scoreCard(
    "Architecture",
    project.architecture.score.score,
    project.architecture.score.rating
)}

${scoreCard(
    "Performance",
    project.performance.score.score,
    project.performance.score.rating
)}

${scoreCard(
    "Security",
    project.security.score.score,
    project.security.score.rating
)}

${scoreCard(
    "Testing",
    project.testing.score.score,
    project.testing.score.rating
)}

${scoreCard(
    "API",
    project.api.score.score,
    project.api.score.rating
)}

${scoreCard(
    "Build",
    project.build.score.score,
    project.build.score.rating
)}

${scoreCard(
    "Documentation",
    project.documentation.score.score,
    project.documentation.score.rating
)}

</div>

<div class="section">

<h2>Project</h2>

<div class="card">

<p><strong>Name:</strong> ${escapeHtml(project.name)}</p>

<p><strong>Version:</strong> ${escapeHtml(project.version)}</p>

<p><strong>Type:</strong> ${escapeHtml(project.projectType)}</p>

<p><strong>Entry Point:</strong> ${escapeHtml(project.entryPoint)}</p>

<p><strong>Language:</strong> ${escapeHtml(project.language)}</p>

<p><strong>Framework:</strong> ${escapeHtml(project.framework)}</p>

<p><strong>Package Manager:</strong>
${escapeHtml(project.packageManager)}</p>

</div>

</div>

<div class="section">

<h2>AI Project Summary</h2>

<div class="card summary">

${escapeHtml(project.intelligence.summary)}

</div>

</div>

${listSection(
    "Strengths",
    project.intelligence.strengths
)}

${listSection(
    "Weaknesses",
    project.intelligence.weaknesses
)}

${listSection(
    "Recommendations",
    project.intelligence.recommendations
)}

<div class="section">

<h2>AI Assessment</h2>

<div class="grid">

<div class="card">
<h3>Grade</h3>
<div class="score">
${escapeHtml(project.intelligence.grade)}
</div>
</div>

<div class="card">
<h3>Maturity</h3>
<div class="score">
${escapeHtml(project.intelligence.maturity)}
</div>
</div>

<div class="card">
<h3>Confidence</h3>
<div class="score">
${escapeHtml(String(project.intelligence.confidence))}%
</div>
</div>

</div>

</div>

<div class="section">

<h2>AI Verdict</h2>

<div class="card summary">

${escapeHtml(project.intelligence.verdict)}

</div>

</div>

${analysisSection("Architecture", [
    ["Modules", project.architecture.totalModules],
    ["Imports", project.architecture.totalImports],
    ["Dependency Depth", project.architecture.dependencyDepth],
    ["Public Modules", project.architecture.publicModules],
    ["Dead Modules", project.architecture.deadModules],
    ["Circular Dependencies", project.architecture.circularDependencies],
    ["Layers", project.architecture.layers.length]
])}

${analysisSection("Performance", [
    ["Heavy Files", project.performance.totalHeavyFiles],
    ["Largest Modules", project.performance.largestModules.length],
    ["Startup Cost", project.performance.startupCost],
    ["Heavy Dependencies", project.performance.heavyDependencies],
    ["Import Density", project.performance.importDensity],
    ["Optimized Modules", project.performance.optimizationSummary.optimized],
    ["Needs Attention", project.performance.optimizationSummary.needsAttention]
])}

${analysisSection("Testing", [
    ["Framework", project.testing.framework],
    ["Test Files", project.testing.testFiles.length],
    ["Unit Tests", project.testing.unitTests],
    ["Integration Tests", project.testing.integrationTests],
    ["E2E Tests", project.testing.e2eTests],
    ["Snapshots", project.testing.snapshots],
    ["Mocks", project.testing.mocks],
    ["Untested Files", project.testing.untestedFiles],
    ["Test Ratio", project.testing.testRatio],
    ["Coverage", project.testing.coverage ? "Yes" : "No"],
    ["Maturity", project.testing.maturity.level]
])}

${analysisSection("API", [
    ["Endpoints", project.api.totalEndpoints],
    ["GraphQL", project.api.graphql ? "Yes" : "No"],
    ["WebSocket", project.api.websocket ? "Yes" : "No"],
    ["Swagger / OpenAPI", project.api.swagger ? "Yes" : "No"],
    ["Middleware", project.api.middleware],
    ["Version", project.api.version],
    ["Complexity", project.api.complexity],
    ["Maturity", project.api.maturity]
])}

${analysisSection("Build", [
    ["Build System", project.build.system],
    ["Output Folders", project.build.outputFolders.length],
    ["Assets", project.build.assets],
    ["Source Maps", project.build.sourceMaps],
    ["Minified Files", project.build.minifiedFiles],
    ["Bundles", project.build.bundles],
    ["Tree Shaking", project.build.treeShaking ? "Yes" : "No"],
    ["Code Splitting", project.build.codeSplitting ? "Yes" : "No"],
    ["Production Ready", project.build.productionReady ? "Yes" : "No"],
    ["Maturity", project.build.maturity]
])}

${analysisSection("Security", [
    ["Environment Files", project.security.envFiles.length],
    ["Dangerous Files", project.security.dangerousFiles.length],
    ["Possible Secrets", project.security.secrets.length],
    ["Sensitive Files", project.security.sensitiveFiles.length]
])}

${analysisSection("Documentation", [
    ["README", project.documentation.readme ? "Yes" : "No"],
    ["CHANGELOG", project.documentation.changelog ? "Yes" : "No"],
    ["CONTRIBUTING", project.documentation.contributing ? "Yes" : "No"],
    ["Code of Conduct", project.documentation.codeOfConduct ? "Yes" : "No"],
    ["Security Policy", project.documentation.security ? "Yes" : "No"],
    ["License", project.documentation.license ? "Yes" : "No"],
    ["README Sections", project.documentation.readmeSections.length],
    ["README Words", project.documentation.readmeStats.words],
    ["README Headings", project.documentation.readmeStats.headings],
    ["Code Blocks", project.documentation.readmeStats.codeBlocks],
    ["Links", project.documentation.readmeStats.links]
])}

${analysisSection("Dependencies", [
    ["Production Packages", project.dependencyAnalysis.production],
    ["Development Packages", project.dependencyAnalysis.development],
    ["Total Packages", project.dependencyAnalysis.total],
    ["Installed Packages", project.dependencyAnalysis.installed],
    ["Installed Size", project.dependencyAnalysis.installedSize],
    ["Unused", project.dependencyAnalysis.unused.length],
    ["Missing", project.dependencyAnalysis.missing.length],
    ["Duplicate Versions", project.dependencyAnalysis.duplicateVersions.length]
])}

${analysisSection("Project Statistics", [
    ["Total Files", project.totalFiles],
    ["Source Files", project.sourceFiles],
    ["Directories", project.directories],
    ["Lines of Code", project.linesOfCode.toLocaleString()],
    ["Empty Directories", project.emptyDirectories],
    ["Hidden Files", project.hiddenFiles],
    ["Project Size", project.projectSize]
])}

${analysisSection("Environment", [
    ["Language", project.language],
    ["Framework", project.framework],
    ["Framework Version", project.frameworkVersion],
    ["Build Tool", project.buildTool],
    ["Build Tool Version", project.buildToolVersion],
    ["Node.js Required", project.nodeVersion],
    ["Docker", project.docker ? "Yes" : "No"],
    ["CI/CD", project.ci],
    ["ESLint", project.eslint ? "Yes" : "No"],
    ["Prettier", project.prettier ? "Yes" : "No"],
    ["Monorepo", project.monorepo ? "Yes" : "No"]
])}

${analysisSection("Repository", [
    ["Git", project.git ? "Yes" : "No"],
    ["Branch", project.gitBranch],
    ["README", project.readme ? "Yes" : "No"],
    ["License", project.license ? "Yes" : "No"],
    ["Remote", project.gitAnalysis.remote || "None"],
    ["Last Commit", project.gitAnalysis.lastCommit || "None"],
    ["Working Tree", project.gitAnalysis.status]
])}

</body>
</html>
`;
}

function scoreCard(
    name: string,
    score: number,
    rating: string
): string {
    return `
<div class="card">
    <h3>${escapeHtml(name)}</h3>
    <div class="score">${score}/100</div>
    <div class="rating">${escapeHtml(rating)}</div>
</div>
`;
}

function listSection(
    title: string,
    items: string[]
): string {

    if (!items || items.length === 0) {
        return "";
    }

    return `
<div class="section">

<h2>${escapeHtml(title)}</h2>

<div class="card">

<ul>

${items
    .map(item => `<li>${escapeHtml(item)}</li>`)
    .join("")}

</ul>

</div>

</div>

`;
}

function analysisSection(
    title: string,
    items: [string, string | number | boolean][]
): string {

    return `
<div class="section">

<h2>${escapeHtml(title)}</h2>

<div class="grid">

${items.map(([label, value]) => `
<div class="card">

<h3>${escapeHtml(label)}</h3>

<div class="score">
${escapeHtml(String(value))}
</div>

</div>
`).join("")}

</div>

</div>
`;
}

function escapeHtml(value: string): string {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}