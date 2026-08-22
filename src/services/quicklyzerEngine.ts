export async function analyzeWorkspace(workspacePath: string) {
    const { analyzeProject } = await import("quicklyzer/dist/services/project.js");
    return analyzeProject(workspacePath);
}