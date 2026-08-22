import * as vscode from 'vscode';

export class AnalysisViewProvider implements vscode.WebviewViewProvider {
    private view?: vscode.WebviewView;

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: false
        };

        webviewView.webview.html = `<!DOCTYPE html>
            <html>
            <body>
                <h2>Quicklyzer</h2>
                <p>Ready to analyze your project.</p>
            </body>
            </html>`;
    }

    public showAnalysis(result: {
        name: string;
        projectScore: {
            score: number;
            rating: string;
        };
    }) {
        if (!this.view) {
            return;
        }

        this.view.webview.html = `
            <!DOCTYPE html>
            <html>
            <body>
                <h2>Analysis Complete</h2>

                <p>
                    <strong>Project:</strong>
                    ${result.name}
                </p>

                <p>
                    <strong>Score:</strong>
                    ${result.projectScore.score}/100
                </p>

                <p>
                    <strong>Rating:</strong>
                    ${result.projectScore.rating}
                </p>
            </body>
            </html>`;
    }
}