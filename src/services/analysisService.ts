export class AnalysisService {
    async analyze(projectPath: string) {
        const { analyzeProject } = await import("quicklyzer/dist/services/project.js");
        return analyzeProject(projectPath);
    }
}