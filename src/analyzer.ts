import * as path from "node:path";
import { pathToFileURL } from "node:url";

export async function analyzeWorkspace(workspacePath: string) {
    const quicklyzerPath = path.resolve(
        workspacePath,
        "..",
        "quicklyzer"
    );

    const projectModulePath = path.join(
        quicklyzerPath,
        "dist",
        "services",
        "project.js"
    );

    const projectModule = await import(
        pathToFileURL(projectModulePath).href
    );

    return projectModule.analyzeProject(workspacePath);
}