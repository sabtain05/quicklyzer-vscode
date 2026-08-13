import * as vscode from 'vscode';
import { ProjectService } from './services/projectService';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklyzer" is now active!');

	const projectService = new ProjectService();

	const disposable = vscode.commands.registerCommand('quicklyzer.analyzeProject', () => {
		const projectPath = projectService.getWorkspacePath();

		if(!projectPath) {
			vscode.window.showWarningMessage('Quicklyzer: Please open a project folder first.');
			return;
		}
		
		vscode.window.showInformationMessage(`Quicklyzer: Project detected at ${projectPath}`);
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
