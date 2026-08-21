import * as vscode from 'vscode';
import { ProjectService } from './services/projectService';
import { AnalysisViewProvider } from './views/analysisViewProvider';
import { analyzeWorkspace } from './services/quicklyzerEngine';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklyzer" is now active!');

	const projectService = new ProjectService();
	const analysisViewProvider = new AnalysisViewProvider();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'quicklyzer.analysisView',
			analysisViewProvider
		)
	);

	const disposable = vscode.commands.registerCommand(
		'quicklyzer.analyzeProject',
		async () => {
			const projectPath = projectService.getWorkspacePath();

			if (!projectPath) {
				vscode.window.showWarningMessage(
					'Quicklyzer: Please open a project folder first.'
				);
				return;
			}

			try {
				const result = analyzeWorkspace(projectPath);

				console.log('Quicklyzer analysis successful:');
				console.log(result);

				vscode.window.showInformationMessage(
					`Quicklyzer: ${result.name} — Score ${result.projectScore.score}/100`
				);
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Unknown analysis error';

				console.error('Quicklyzer analysis failed:', error);

				vscode.window.showErrorMessage(
					`Quicklyzer analysis failed: ${message}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}