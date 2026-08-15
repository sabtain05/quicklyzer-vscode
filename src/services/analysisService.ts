export class AnalysisService {
    async analyze(projectPath: string) {
        const mod = await import("quicklyzer/dist/services/project.js");
        const analyzeProject = mod.analyzeProject as (path: string) => any;
        const project = analyzeProject(projectPath);

        return {
            success: true,
            message: `Analyzed ${project.name} successfully.`,
        };
    }
}