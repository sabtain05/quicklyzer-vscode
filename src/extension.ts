import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quicklyzer" is now active!');

	const disposable = vscode.commands.registerCommand('quicklyzer.analyzeProject', () => {
		
		vscode.window.showInformationMessage('Quicklyzer: Analyze Project');
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
