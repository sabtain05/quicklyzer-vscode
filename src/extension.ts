import * as vscode from 'vscode';
import { AnalysisViewProvider } from './views/analysisViewProvider';
import { analyzeWorkspace } from './services/quicklyzerEngine';

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "quicklyzer" is now active!'
	);

	const analysisViewProvider = new AnalysisViewProvider();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'quicklyzer.analysisView',
			analysisViewProvider
		)
	);

	const analyzeCommand = vscode.commands.registerCommand(
    "quicklyzer.analyzeProject",
    async () => {

        const workspaceFolder =
            vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder) {
            vscode.window.showErrorMessage(
                "Quicklyzer: No workspace is open."
            );
            return;
        }

        analysisViewProvider.showLoading();

        try {

            const result = await analyzeWorkspace(
                workspaceFolder.uri.fsPath
            );

            analysisViewProvider.showAnalysis(result);

            vscode.window.showInformationMessage(
                `Quicklyzer: Analysis complete — ${result.name}`
            );

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown error.";

            console.error(
                "Quicklyzer analysis failed:",
                error
            );

            analysisViewProvider.showError(message);

            vscode.window.showErrorMessage(
                `Quicklyzer: ${message}`
            );
        }
    }
);

	context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
        "quicklyzer.analysisView",
        analysisViewProvider,
        {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        }
    )
);
}

export function deactivate() {}