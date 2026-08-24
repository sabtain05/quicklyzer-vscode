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
        totalModules: number;
        totalImports: number;
        circularDependencies: number;
    };

    performance: {
        score: {
            score: number;
            rating: string;
        };
        totalHeavyFiles: number;
    };

    testing: {
        score: {
            score: number;
            rating: string;
        };
        framework: string;
        testFiles: string[];
    };

    api: {
        totalEndpoints: number;
        graphql: boolean;
        websocket: boolean;
        swagger: boolean;
    };
}