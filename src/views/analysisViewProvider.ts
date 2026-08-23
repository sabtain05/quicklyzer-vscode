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

    public showLoading(): void {
        if(!this.view) {
            return;
        }

        this.view.webview.html = this.getLoadingHtml();
    }

    public showAnalysis(result: any): void {
        if(!this.view) {
            return;
        }
        this.view.webview.html = this.getDashboardHtml(result);
    }

    public showError(message: string): void {
        if(!this.view) {
            return;
        }
        this.view.webview.html = `
        <!DOCTYPE html>
        <html>
        <body>
            <div class="container">
                <h1>Quicklyzer</h1>
                <div class="error">
                    <h2>Analysis Failed</h2>
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <button onclick="analyze()">Try Again</button>
            </div>
            
            ${this.getScript()}
        </body>
        </html>
        
        ${this.getStyles()}`;
    }

    private getWelcomeHtml(): string {
        return `
        <!DOCTYPE html>
        <html>
        <body>
            <div class="container">
                <div class="hero">
                    <div class="logo">Q</div>
                    <h1>Quicklyzer</h1>
                    <p>Intelligent software project analysis.</p>
                </div>

                <button class="primary" onclick="analyze()">
                    Analyze Project
                </button>

                <p class="hint">
                    Analyze the currently opened workspace.
                </p>
            </div>

            ${this.getStyles()}
            ${this.getScript()}
        </body>
        </html>
        `;
    }

    private getLoadingHtml(): string {
        return `
        <!DOCTYPE html>
            <html>
            <body>
                <div class="container loading">
                    <div class="spinner"></div>
                    <h2>Analyzing project...</h2>
                    <p>Quicklyzer is analyzing your workspace.</p>
                    <p class="hint">
                        Architecture, dependencies, testing, security,
                        Git, documentation and more.
                    </p>
                </div>

                ${this.getStyles()}
            </body>
            </html>
        `;
    }

    private getDashboardHtml(project: any): string {
        const score = project.projectScore?.score??0;
        const rating = project.projectScore?.rating?? "Unknown";
    }
}