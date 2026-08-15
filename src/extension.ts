import * as vscode from 'vscode';
import { ProjectService } from './services/projectService';
import { AnalysisService } from './services/analysisService';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklyzer" is now active!');

	const projectService = new ProjectService();
	const analysisService = new AnalysisService();

	let disposable = vscode.commands.registerCommand('quicklyzer.analyzeProject', async () => {
		const projectPath = projectService.getWorkspacePath();

		if(!projectPath) {
			vscode.window.showWarningMessage('Quicklyzer: Please open a project folder first.');
			return;
		}

		const result = await analysisService.analyze(projectPath);
		
		// ProjectInfo may not have a 'message' property; show a sensible default
		const info = (result as any)?.message ?? 'Analysis complete';
		vscode.window.showInformationMessage(info);
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
