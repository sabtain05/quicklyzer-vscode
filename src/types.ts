export interface QuicklyzerAnalysis {
    name: string;
    version: string;
    projectType: string;
    entryPoint: string;

    projectScore: {
        score: number;
        rating: string;
    };
}