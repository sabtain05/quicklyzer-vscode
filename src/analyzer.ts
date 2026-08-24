import * as path from "node:path";


export async function analyzeWorkspace(workspacePath: string) {
    const quicklyzerPath = path.resolve("..", "quicklyzer");
    const projectModule = await import (path.join(quicklyzerPath,"dist","services","project.js"));
}