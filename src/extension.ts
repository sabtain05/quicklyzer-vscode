import * as vscode from "vscode";
import { analyzeWorkspace } from "./analyzer";
import { showDashboard } from "./dashboard";
import { QuicklyzerSidebarProvider } from "./sidebar";

export function activate(context: vscode.ExtensionContext) {
    console.log('Quicklyzer extension is now active.');

    const sidebarProvider =
    new QuicklyzerSidebarProvider();

context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
        QuicklyzerSidebarProvider.viewType,
        sidebarProvider
    )
);

    const analyzeCommand = vscode.commands.registerCommand(
        "quicklyzer.analyzeProject",
        async () => {
            const workspace = vscode.workspace.workspaceFolders?.[0];

            if (!workspace) {
                vscode.window.showErrorMessage(
                    "Quicklyzer: Please open a project folder first."
                );
                return;
            }

            const output = vscode.window.createOutputChannel("Quicklyzer");

            try {
                output.show(true);
                output.appendLine("Quicklyzer");
                output.appendLine("==============================");
                output.appendLine("");
                output.appendLine("Analyzing project...");
                output.appendLine("");

                const project = await analyzeWorkspace(
                    workspace.uri.fsPath
                );
                showDashboard(project);

                output.clear();

                output.appendLine("QUICKLYZER");
                output.appendLine("==============================");
                output.appendLine("");

                output.appendLine("PROJECT");
                output.appendLine("------------------------------");
                output.appendLine(`Name        : ${project.name}`);
                output.appendLine(`Version     : ${project.version}`);
                output.appendLine(`Type        : ${project.projectType}`);
                output.appendLine(`Entry Point : ${project.entryPoint}`);
                output.appendLine("");

                output.appendLine("PROJECT SCORE");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Score  : ${project.projectScore.score}/100`
                );
                output.appendLine(
                    `Rating : ${project.projectScore.rating}`
                );
                output.appendLine("");

                output.appendLine("ARCHITECTURE");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Modules   : ${project.architecture.totalModules}`
                );
                output.appendLine(
                    `Imports   : ${project.architecture.totalImports}`
                );
                output.appendLine(
                    `Circular Dependencies   : ${project.architecture.circularDependencies}`
                );
                output.appendLine(
                    `Score     : ${project.architecture.score.score}/100`
                );
                output.appendLine("");

                output.appendLine("PERFORMANCE");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Heavy Files : ${project.performance.totalHeavyFiles}`
                );
                output.appendLine(
                    `Score       : ${project.performance.score.score}/100`
                );
                output.appendLine("");

                output.appendLine("TESTING");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Framework   : ${project.testing.framework}`
                );
                output.appendLine(
                    `Test Files  : ${project.testing.testFiles.length}`
                );
                output.appendLine(
                    `Score       : ${project.testing.score.score}/100`
                );
                output.appendLine("");

                output.appendLine("API");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Endpoints : ${project.api.totalEndpoints}`
                );
                output.appendLine(
                    `GraphQL   : ${project.api.graphql ? "Yes" : "No"}`
                );
                output.appendLine(
                    `WebSocket : ${project.api.websocket ? "Yes" : "No"}`
                );
                output.appendLine(
                    `OpenAPI   : ${project.api.swagger ? "Yes" : "No"}`
                );
                output.appendLine("");

                output.appendLine("BUILD");
                output.appendLine("------------------------------");
                output.appendLine(
                    `System : ${project.build.system}`
                );
                output.appendLine(
                    `Score  : ${project.build.score.score}/100`
                );
                output.appendLine("");

                output.appendLine("SECURITY");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Score          : ${project.security.score.score}/100`
                );
                output.appendLine(
                    `Possible Secrets: ${project.security.secrets.length}`
                );
                output.appendLine(
                    `Sensitive Files : ${project.security.sensitiveFiles.length}`
                );
                output.appendLine("");

                output.appendLine("DOCUMENTATION");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Score : ${project.documentation.score.score}/100`
                );
                output.appendLine("");

                output.appendLine("AI PROJECT SUMMARY");
                output.appendLine("------------------------------");
                output.appendLine(project.intelligence.summary);
                output.appendLine("");

                output.appendLine("AI VERDICT");
                output.appendLine("------------------------------");
                output.appendLine(project.intelligence.verdict);
                output.appendLine("");

                output.appendLine("GRADE");
                output.appendLine("------------------------------");
                output.appendLine(
                    `Grade     : ${project.intelligence.grade}`
                );
                output.appendLine(
                    `Maturity  : ${project.intelligence.maturity}`
                );
                output.appendLine("");

                if (project.intelligence.strengths.length) {
                    output.appendLine("STRENGTHS");
                    output.appendLine("------------------------------");

                    for (const item of project.intelligence.strengths) {
                        output.appendLine(`✓ ${item}`);
                    }

                    output.appendLine("");
                }

                if (project.intelligence.weaknesses.length) {
                    output.appendLine("WEAKNESSES");
                    output.appendLine("------------------------------");

                    for (const item of project.intelligence.weaknesses) {
                        output.appendLine(`• ${item}`);
                    }

                    output.appendLine("");
                }

                if (project.intelligence.recommendations.length) {
                    output.appendLine("RECOMMENDATIONS");
                    output.appendLine("------------------------------");

                    for (const item of project.intelligence.recommendations) {
                        output.appendLine(`• ${item}`);
                    }

                    output.appendLine("");
                }

                vscode.window.showInformationMessage(
                    `Quicklyzer: Analysis complete — ${project.name}`
                );
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unknown error.";

                output.appendLine("");
                output.appendLine("ANALYSIS FAILED");
                output.appendLine("------------------------------");
                output.appendLine(message);

                vscode.window.showErrorMessage(
                    `Quicklyzer: ${message}`
                );
            }
        }
    );

    context.subscriptions.push(analyzeCommand);
}

export function deactivate() {}