export async function analyzeWorkspace(workspacePath: string) {
    // Dynamically import the ESM module to avoid CommonJS 'require' issues.
    const { analyzeProject } = await import("quicklyzer/dist/services/project.js");
    // The CLI logic is now dynamically imported and bundled by esbuild.
    return await analyzeProject(workspacePath);
}