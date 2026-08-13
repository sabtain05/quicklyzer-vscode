export interface AnalysisResult {
    success: boolean;
    message: string;
}

export class AnalysisService {
    async analyze(projectPath: string): Promise<AnalysisResult> {
        return {
            success: true,
            message: `Analysis started for: ${projectPath}`,
        };
    }
}