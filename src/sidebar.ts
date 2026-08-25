import * as vscode from "vscode";


export class QuicklyzerSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "quicklyzer.dashboard";
    private view?: vscode.WebviewView;

    constructor(private readonly extensionUri: vscode.Uri) {}
    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this.view = webviewView;
        webviewView.webview.options = {enableScripts: true};
        webviewView.webview.html = this.getHtml();
    }
}