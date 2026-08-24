export interface QuicklyzerAnalysis {
    name: string;
    version: string;
    projectType: string;
    entryPoint: string;

    projectScore: {
        score: number;
        rating: string;
    };

    architecture: {
        score: {
            score: number;
            rating: string;
        };
        
    }
}