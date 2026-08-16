import { analyzeProject } from "quicklyzer/dist/services/project.js";

export class AnalysisService {
    async analyze(projectPath: string) {
        return analyzeProject(projectPath);
    }
}