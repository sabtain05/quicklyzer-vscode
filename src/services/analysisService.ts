import { analyzeProject } from "quicklyzer/dist/services/project.js";

export class AnalysisService {
    async analyze(projectPath: string) {
        const project = analyzeProject(projectPath);

        return {
            success: true,
            message: `Analyzed ${project.name} successfully.`,
        };
    }
}