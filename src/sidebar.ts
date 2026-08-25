import * as vscode from "vscode";

export class QuicklyzerSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "quicklyzer.dashboard";

 

  constructor() {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
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

    webviewView.webview.html = this.getHtml();
}


  private getHtml(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <style>
    body {
        padding: 16px;
        color: var(--vscode-foreground);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    h2 {
        margin-top: 0;
    }

    button {
        width: 100%;
        padding: 8px;
        margin-top: 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: var(--vscode-button-foreground);
        background: var(--vscode-button-background);
    } 

    button:hover {
        background: var(--vscode-button-hoverBackground);
    }

    .status {
        margin-top: 20px;
        opacity: 0.7;
    }

    </style>
    </head>
    <body>
        <h2>QUICKLYZER</h2>
        <p>Project analyzer and intelligence dashboard.</p>

        <button id="analyze">Analyze Project</button>

        <div class="status" id="status">Ready to analyze your project.</div>

    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById("analyze").addEventListener("click", () => {
            vscode.postMessage({
                command: "analyze"
            });
        });

    </script>
    </body>
    </html>
    `;
   }
}
