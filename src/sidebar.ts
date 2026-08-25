import * as vscode from "vscode";


export class QuicklyzerSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "quicklyzer.dashboard";
    private view?: vscode.WebviewView;
}