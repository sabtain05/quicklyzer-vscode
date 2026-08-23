import * as vscode from "vscode";


export class AnalysisViewProvider implements vscode.WebviewViewProvider {
    private view?: vscode.WebviewView;
    resolveWebviewView(webviewView: vscode.WebviewView): void{
        this.view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        
        webviewView.webview.html = this.getWelcomeHtml();
        webviewView.webview.onDidReceiveMessage(async (message) => {
            if(message.command === "analyze") {
                await vscode.commands.executeCommand("quicklyzer.analyzeProject");
            }
        });
    }

    public showLoading(): void {
        if(!this.view) {
            return;
        }

        this.view.webview.html = this.getLoadingHtml();
    }

    public showAnalysis(result: any): void {
        if(!this.view) {
            return;
        }
        this.view.webview.html = this.getDashboardHtml(result);
    }

    public showError(message: string): void {
        if(!this.view) {
            return;
        }
        this.view.webview.html = `
        <!DOCTYPE html>
        <html>
        <body>
            <div class="container">
                <h1>Quicklyzer</h1>
                <div class="error">
                    <h2>Analysis Failed</h2>
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <button onclick="analyze()">Try Again</button>
            </div>
            
            ${this.getScript()}
        </body>
        </html>
        
        ${this.getStyles()}`;
    }

    private getWelcomeHtml(): string {
        return `
        <!DOCTYPE html>
        <html>
        <body>
            <div class="container">
                <div class="hero">
                    <div class="logo">Q</div>
                    <h1>Quicklyzer</h1>
                    <p>Intelligent software project analysis.</p>
                </div>

                <button class="primary" onclick="analyze()">
                    Analyze Project
                </button>

                <p class="hint">
                    Analyze the currently opened workspace.
                </p>
            </div>

            ${this.getStyles()}
            ${this.getScript()}
        </body>
        </html>
        `;
    }

    private getLoadingHtml(): string {
        return `
        <!DOCTYPE html>
            <html>
            <body>
                <div class="container loading">
                    <div class="spinner"></div>
                    <h2>Analyzing project...</h2>
                    <p>Quicklyzer is analyzing your workspace.</p>
                    <p class="hint">
                        Architecture, dependencies, testing, security,
                        Git, documentation and more.
                    </p>
                </div>

                ${this.getStyles()}
            </body>
            </html>
        `;
    }

    private getDashboardHtml(project: any): string {
        const score = project.projectScore?.score??0;
        const rating = project.projectScore?.rating?? "Unknown";

        return `
         <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>

            <body>

                <div class="container">

                    <header class="header">
                        <div>
                            <div class="brand">QUICKLYZER</div>
                            <h1>${this.escapeHtml(project.name ?? "Unknown")}</h1>
                            <p class="muted">
                                ${this.escapeHtml(project.projectType ?? "Unknown")}
                                ·
                                ${this.escapeHtml(project.language ?? "Unknown")}
                            </p>
                        </div>

                        <div class="actions">
                            <button onclick="refresh()">
                                ↻ Refresh
                            </button>
                        </div>
                    </header>

                    <section class="hero-card">

                        <div>
                            <span class="label">PROJECT SCORE</span>
                            <div class="big-score">
                                ${score}<span>/100</span>
                            </div>
                            <div class="rating">
                                ${this.escapeHtml(rating)}
                            </div>
                        </div>

                        <div class="project-meta">
                            <div>
                                <span>Version</span>
                                <strong>${this.escapeHtml(project.version ?? "Unknown")}</strong>
                            </div>

                            <div>
                                <span>Framework</span>
                                <strong>${this.escapeHtml(project.framework ?? "Unknown")}</strong>
                            </div>

                            <div>
                                <span>Build Tool</span>
                                <strong>${this.escapeHtml(project.buildTool ?? "Unknown")}</strong>
                            </div>

                            <div>
                                <span>Package Manager</span>
                                <strong>${this.escapeHtml(project.packageManager ?? "Unknown")}</strong>
                            </div>
                        </div>

                    </section>

                    <section>
                        <h2>Health Overview</h2>

                        <div class="grid">

                            ${this.scoreCard(
                                "Architecture",
                                project.architecture?.score
                            )}

                            ${this.scoreCard(
                                "Performance",
                                project.performance?.score
                            )}

                            ${this.scoreCard(
                                "Testing",
                                project.testing?.score
                            )}

                            ${this.scoreCard(
                                "API",
                                project.api?.score
                            )}

                            ${this.scoreCard(
                                "Build",
                                project.build?.score
                            )}

                            ${this.scoreCard(
                                "Security",
                                project.security?.score
                            )}

                            ${this.scoreCard(
                                "Documentation",
                                project.documentation?.score
                            )}

                            ${this.scoreCard(
                                "Repository",
                                project.gitAnalysis?.health
                            )}

                        </div>
                    </section>

                    <section>
                        <h2>Project Statistics</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Files",
                                project.totalFiles
                            )}

                            ${this.stat(
                                "Source Files",
                                project.sourceFiles
                            )}

                            ${this.stat(
                                "Directories",
                                project.directories
                            )}

                            ${this.stat(
                                "Lines of Code",
                                this.formatNumber(project.linesOfCode)
                            )}

                            ${this.stat(
                                "Dependencies",
                                project.totalDependencyCount
                            )}

                            ${this.stat(
                                "Project Size",
                                this.formatBytes(project.projectSize)
                            )}

                            ${this.stat(
                                "Entry Point",
                                project.entryPoint
                            )}

                            ${this.stat(
                                "Node",
                                project.nodeVersion
                            )}

                        </div>
                    </section>

                    <section>
                        <h2>Architecture</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Modules",
                                project.architecture?.totalModules
                            )}

                            ${this.stat(
                                "Imports",
                                project.architecture?.totalImports
                            )}

                            ${this.stat(
                                "Dependency Depth",
                                project.architecture?.dependencyDepth
                            )}

                            ${this.stat(
                                "Public Modules",
                                project.architecture?.publicModules
                            )}

                            ${this.stat(
                                "Dead Modules",
                                project.architecture?.deadModules
                            )}

                            ${this.stat(
                                "Circular Dependencies",
                                project.architecture?.circularDependencies
                            )}

                        </div>

                        ${this.listSection(
                            "Architecture Recommendations",
                            project.architecture?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Performance</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Heavy Files",
                                project.performance?.totalHeavyFiles
                            )}

                            ${this.stat(
                                "Largest Modules",
                                project.performance?.largestModules?.length
                            )}

                            ${this.stat(
                                "Startup Cost",
                                project.performance?.startupCost
                            )}

                            ${this.stat(
                                "Heavy Dependencies",
                                project.performance?.heavyDependencies
                            )}

                            ${this.stat(
                                "Import Density",
                                project.performance?.importDensity
                            )}

                        </div>

                        ${this.listSection(
                            "Performance Recommendations",
                            project.performance?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Testing</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Framework",
                                project.testing?.framework
                            )}

                            ${this.stat(
                                "Test Files",
                                project.testing?.testFiles?.length
                            )}

                            ${this.stat(
                                "Unit Tests",
                                project.testing?.unitTests
                            )}

                            ${this.stat(
                                "Integration Tests",
                                project.testing?.integrationTests
                            )}

                            ${this.stat(
                                "E2E Tests",
                                project.testing?.e2eTests
                            )}

                            ${this.stat(
                                "Snapshots",
                                project.testing?.snapshots
                            )}

                            ${this.stat(
                                "Mocks",
                                project.testing?.mocks
                            )}

                            ${this.stat(
                                "Coverage",
                                project.testing?.coverage ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Untested Files",
                                project.testing?.untestedFiles
                            )}

                            ${this.stat(
                                "Test Ratio",
                                project.testing?.testRatio
                            )}

                        </div>

                        ${this.listSection(
                            "Testing Recommendations",
                            project.testing?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>API</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Endpoints",
                                project.api?.totalEndpoints
                            )}

                            ${this.stat(
                                "GET",
                                project.api?.methods?.GET
                            )}

                            ${this.stat(
                                "POST",
                                project.api?.methods?.POST
                            )}

                            ${this.stat(
                                "PUT",
                                project.api?.methods?.PUT
                            )}

                            ${this.stat(
                                "PATCH",
                                project.api?.methods?.PATCH
                            )}

                            ${this.stat(
                                "DELETE",
                                project.api?.methods?.DELETE
                            )}

                            ${this.stat(
                                "GraphQL",
                                project.api?.graphql ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "WebSocket",
                                project.api?.websocket ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Swagger/OpenAPI",
                                project.api?.swagger ? "Yes" : "No"
                            )}

                        </div>

                        ${this.listSection(
                            "API Recommendations",
                            project.api?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Build</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "System",
                                project.build?.system
                            )}

                            ${this.stat(
                                "Assets",
                                project.build?.assets
                            )}

                            ${this.stat(
                                "Source Maps",
                                project.build?.sourceMaps
                            )}

                            ${this.stat(
                                "Minified Files",
                                project.build?.minifiedFiles
                            )}

                            ${this.stat(
                                "Bundles",
                                project.build?.bundles
                            )}

                            ${this.stat(
                                "Tree Shaking",
                                project.build?.treeShaking ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Code Splitting",
                                project.build?.codeSplitting ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Production Ready",
                                project.build?.productionReady ? "Yes" : "No"
                            )}

                        </div>

                        ${this.listSection(
                            "Build Recommendations",
                            project.build?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Dependencies</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Production",
                                project.dependencyAnalysis?.production
                            )}

                            ${this.stat(
                                "Development",
                                project.dependencyAnalysis?.development
                            )}

                            ${this.stat(
                                "Total",
                                project.dependencyAnalysis?.total
                            )}

                            ${this.stat(
                                "Installed",
                                project.dependencyAnalysis?.installed
                            )}

                            ${this.stat(
                                "Installed Size",
                                project.dependencyAnalysis?.installedSize
                            )}

                            ${this.stat(
                                "Unused",
                                project.dependencyAnalysis?.unused?.length
                            )}

                            ${this.stat(
                                "Missing",
                                project.dependencyAnalysis?.missing?.length
                            )}

                            ${this.stat(
                                "Duplicate Versions",
                                project.dependencyAnalysis?.duplicateVersions?.length
                            )}

                            ${this.stat(
                                "Risk Score",
                                project.dependencyAnalysis?.riskScore?.score
                            )}

                        </div>

                    </section>

                    <section>
                        <h2>Security</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Environment Files",
                                project.security?.envFiles?.length
                            )}

                            ${this.stat(
                                "Dangerous Files",
                                project.security?.dangerousFiles?.length
                            )}

                            ${this.stat(
                                "Possible Secrets",
                                project.security?.secrets?.length
                            )}

                            ${this.stat(
                                "Sensitive Files",
                                project.security?.sensitiveFiles?.length
                            )}

                        </div>

                        ${this.listSection(
                            "Security Recommendations",
                            project.security?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Git Intelligence</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "Repository",
                                project.gitAnalysis?.available ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Branch",
                                project.gitAnalysis?.branch || "None"
                            )}

                            ${this.stat(
                                "Local Branches",
                                project.gitAnalysis?.localBranches
                            )}

                            ${this.stat(
                                "Tags",
                                project.gitAnalysis?.tags
                            )}

                            ${this.stat(
                                "Modified Files",
                                project.gitAnalysis?.modifiedFiles
                            )}

                            ${this.stat(
                                "Staged Files",
                                project.gitAnalysis?.stagedFiles
                            )}

                            ${this.stat(
                                "Untracked Files",
                                project.gitAnalysis?.untrackedFiles
                            )}

                            ${this.stat(
                                "Ahead",
                                project.gitAnalysis?.ahead
                            )}

                            ${this.stat(
                                "Behind",
                                project.gitAnalysis?.behind
                            )}

                        </div>

                        ${this.listSection(
                            "Git Recommendations",
                            project.gitAnalysis?.recommendations
                        )}

                    </section>

                    <section>
                        <h2>Documentation</h2>

                        <div class="grid stats">

                            ${this.stat(
                                "README",
                                project.documentation?.readme ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "CHANGELOG",
                                project.documentation?.changelog ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "CONTRIBUTING",
                                project.documentation?.contributing ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "Security",
                                project.documentation?.security ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "License",
                                project.documentation?.license ? "Yes" : "No"
                            )}

                            ${this.stat(
                                "README Words",
                                project.documentation?.readmeStats?.words
                            )}

                            ${this.stat(
                                "README Headings",
                                project.documentation?.readmeStats?.headings
                            )}

                            ${this.stat(
                                "Code Blocks",
                                project.documentation?.readmeStats?.codeBlocks
                            )}

                            ${this.stat(
                                "Links",
                                project.documentation?.readmeStats?.links
                            )}

                            ${this.stat(
                                "Badges",
                                project.documentation?.readmeStats?.badges
                            )}

                        </div>

                        ${this.listSection(
                            "Documentation Recommendations",
                            project.documentation?.recommendations
                        )}

                    </section>

                    <section class="ai-section">

                        <h2>AI Project Intelligence</h2>

                        <div class="summary">
                            ${this.escapeHtml(
                                project.intelligence?.summary ??
                                "No AI summary available."
                            )}
                        </div>

                        <div class="grid">

                            ${this.stat(
                                "Maintainability",
                                `${project.intelligence?.maintainability?.score ?? 0}/100`
                            )}

                            ${this.stat(
                                "Scalability",
                                `${project.intelligence?.scalability?.score ?? 0}/100`
                            )}

                            ${this.stat(
                                "Confidence",
                                `${project.intelligence?.confidence ?? 0}%`
                            )}

                            ${this.stat(
                                "Grade",
                                project.intelligence?.grade
                            )}

                            ${this.stat(
                                "Maturity",
                                project.intelligence?.maturity
                            )}

                            ${this.stat(
                                "Risk",
                                project.intelligence?.risk
                            )}

                            ${this.stat(
                                "Technical Debt",
                                project.intelligence?.technicalDebt
                            )}

                        </div>

                        ${this.listSection(
                            "Strengths",
                            project.intelligence?.strengths
                        )}

                        ${this.listSection(
                            "Weaknesses",
                            project.intelligence?.weaknesses
                        )}

                        ${this.listSection(
                            "AI Recommendations",
                            project.intelligence?.recommendations
                        )}

                        ${this.listSection(
                            "Improvement Roadmap",
                            project.intelligence?.roadmap
                        )}

                        <div class="verdict">
                            <strong>AI Verdict</strong>
                            <p>
                                ${this.escapeHtml(
                                    project.intelligence?.verdict ??
                                    "No verdict available."
                                )}
                            </p>
                        </div>

                    </section>

                    <footer>
                        Quicklyzer · Intelligent Software Project Analysis
                    </footer>

                </div>

                ${this.getStyles()}
                ${this.getScript()}

            </body>
            </html>
        `;
    }
}