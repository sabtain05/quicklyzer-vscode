import * as vscode from "vscode";
import { analyzeWorkspace } from "./analyzer";
import { showDashboardLoading, showDashboardResult, showDashboardError } from "./dashboard";
import { QuicklyzerSidebarProvider } from "./sidebar";

export function activate(context: vscode.ExtensionContext) {
    console.log('Quicklyzer extension is now active.');

    const sidebarProvider = new QuicklyzerSidebarProvider(context.extensionUri);

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

            try {
                // 1. Immediately open dashboard and show pulsing logo
                showDashboardLoading(context.extensionUri);

                // 2. Run the heavy analysis
                const project = await analyzeWorkspace(workspace.uri.fsPath);

                // 3. Render the full HTML dashboard
                showDashboardResult(project, context.extensionUri);

                vscode.window.showInformationMessage(
                    `Quicklyzer: Analysis complete — ${project.name}`
                );
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error.";
                
                // Show professional error state in the dashboard
                showDashboardError(message, context.extensionUri);
                vscode.window.showErrorMessage(`Quicklyzer: ${message}`);
            }
        }
    );

    context.subscriptions.push(analyzeCommand);
}

export function deactivate() {}