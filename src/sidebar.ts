import * as vscode from "vscode";

export class QuicklyzerSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "quicklyzer.dashboard";

    // Pass extensionUri in the constructor so we can load the PNG logo
    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.onDidReceiveMessage(
            async message => {
                if (message.command === "analyze") {
                    await vscode.commands.executeCommand(
                        "quicklyzer.analyzeProject"
                    );
                }
            },
            undefined,
            []
        );

        webviewView.webview.html = this.getHtml(webviewView.webview);
    }

    private getHtml(webview: vscode.Webview): string {
        // Securely resolve the local PNG logo path
        const logoUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "resources", "quicklyzer.png")
        );

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                padding: 24px 16px;
                color: var(--vscode-foreground);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .logo {
                width: 80px;
                height: 80px;
                object-fit: contain;
                margin-bottom: 16px;
            }

            h2 {
                margin: 0 0 8px 0;
                font-size: 18px;
                font-weight: 600;
            }

            p {
                margin: 0 0 24px 0;
                opacity: 0.7;
                font-size: 13px;
                line-height: 1.5;
            }

            button {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                color: var(--vscode-button-foreground);
                background: var(--vscode-button-background);
                transition: background 0.2s, opacity 0.2s;
            } 

            button:hover {
                background: var(--vscode-button-hoverBackground);
            }
        </style>
        </head>
        <body>
            <img src="${logoUri}" alt="Quicklyzer" class="logo">
            <h2>Quicklyzer</h2>
            <p>Ready to analyze your project and generate intelligence metrics.</p>

            <button id="analyze">Analyze Project</button>

        <script>
            const vscode = acquireVsCodeApi();
            const btn = document.getElementById("analyze");
            
            btn.addEventListener("click", () => {
                // Visual feedback that the click registered
                btn.innerText = "Analyzing...";
                btn.style.opacity = "0.8";

                vscode.postMessage({
                    command: "analyze"
                });

                // Reset button text after a short delay since dashboard will open
                setTimeout(() => {
                    btn.innerText = "Analyze Project";
                    btn.style.opacity = "1";
                }, 2000);
            });
        </script>
        </body>
        </html>
        `;
    }
}