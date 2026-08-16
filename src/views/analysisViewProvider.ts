import * as vscode from 'vscode';


export class AnalysisViewProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.options = {
            enableScripts: false
        };

        webviewView.webview.html =
        
    }
}