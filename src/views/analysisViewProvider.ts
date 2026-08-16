import * as vscode from 'vscode';


export class AnalysisViewProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.options = {
            enableScripts: false
        };

        webviewView.webview.html =
        `<!DOCTYPE html>
         <html>
         <body>
            <h2>Quicklyzer</h2>
            <p>Ready to analyze your project.</p>
    }
}