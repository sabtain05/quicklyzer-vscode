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
		
		vscode.window.showInformationMessage(`Analysis complete: ${result.name}`);
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
