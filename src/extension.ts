import * as vscode from 'vscode';
import { AnalysisViewProvider } from './views/analysisViewProvider';
import { analyzeWorkspace } from './services/quicklyzerEngine';

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "quicklyzer" is now active!'
	);

	// ------------------------------------------------------------
	// Quicklyzer Webview
	// ------------------------------------------------------------

	const analysisViewProvider = new AnalysisViewProvider();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'quicklyzer.analysisView',
			analysisViewProvider
		)
	);

	// ------------------------------------------------------------
	// Analyze Project Command
	// ------------------------------------------------------------

	const analyzeCommand = vscode.commands.registerCommand(
		'quicklyzer.analyzeProject',
		async () => {
			const workspaceFolder =
				vscode.workspace.workspaceFolders?.[0];

			if (!workspaceFolder) {
				vscode.window.showErrorMessage(
					'Quicklyzer: No workspace is open.'
				);
				return;
			}

			try {
				const result = await analyzeWorkspace(
					workspaceFolder.uri.fsPath
				);

				// Send analysis results to the Quicklyzer Webview
				analysisViewProvider.showAnalysis(result);

				console.log(
					'Quicklyzer analysis successful:',
					result
				);

				vscode.window.showInformationMessage(
					`Quicklyzer: Analysis complete — ${result.name}`
				);
			} catch (error) {
				console.error(
					'Quicklyzer analysis failed:',
					error
				);

				vscode.window.showErrorMessage(
					'Quicklyzer: Analysis failed.'
				);
			}
		}
	);

	context.subscriptions.push(analyzeCommand);
}

export function deactivate() {}