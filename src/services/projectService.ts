import * as vscode from 'vscode';


export class ProjectService {
    getWorkspacePath(): string | undefined {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if(!workspaceFolders) {
            return undefined;
        }
    }
}