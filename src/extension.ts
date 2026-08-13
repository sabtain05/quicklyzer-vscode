import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklyzer" is now active!');

	const disposable = vscode.commands.registerCommand('quicklyzer.analyzeProject', () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if(!workspaceFolders) {
			vscode.window.showWarningMessage('Quicklyzer: Please open a project folder first.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		
		vscode.window.showInformationMessage(`Quicklyzer: Project detected at ${projectPath}`);
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
