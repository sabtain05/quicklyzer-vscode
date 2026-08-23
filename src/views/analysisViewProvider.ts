import * as vscode from "vscode";


export class AnalysisViewProvider implements vscode.WebviewViewProvider {
    private view?: vscode.WebviewView;
    resolveWebviewView(webviewView: vscode.WebviewView): void{
        this.view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        
        webviewView.webview.html = this.getWelcomeHtml();
        webviewView.webview.onDidReceiveMessage(async (message) => {
            if(message.command === "analyze") {
                await vscode.commands.executeCommand("quicklyzer.analyzeProject");
            }
        });
    }
}