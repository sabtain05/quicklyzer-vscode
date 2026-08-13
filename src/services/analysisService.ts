export interface AnalysisResult {
    success: boolean;
    message: string;
}

export class AnalysisService {
    async analyze(projectPath: string): Promise<AnalysisResult> {
        
    }
}