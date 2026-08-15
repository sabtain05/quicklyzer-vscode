import { AnalysisResult } from "../models/projectInfo";

export class AnalysisService {
    async analyze(projectPath: string): Promise<AnalysisResult> {
        return {
            success: true,
            message: `Analysis started for: ${projectPath}`,
        };
    }
}