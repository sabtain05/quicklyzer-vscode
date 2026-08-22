import { analyzeProject } from "quicklyzer/dist/services/project.js";

export function analyzeWorkspace(workspacePath: string) {
    return analyzeProject(workspacePath);
}