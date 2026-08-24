import * as vscode from "vscode";

export function showDashboard(
    context: vscode.ExtensionContext,
    project: any
) {
    const panel = vscode.window.createWebviewPanel(
        "quicklyzerDashboard",
        "Quicklyzer",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getHtml(project);
}

function getHtml(project: any): string {
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

function escapeHtml(value: string): string {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}