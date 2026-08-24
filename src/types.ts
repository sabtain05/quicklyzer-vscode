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

    build: {
        system: string;
        score: {
            score: number;
            rating: string;
        };
    };

    security: {
        score: {
            score: number;
            rating: string;
        };
        secrets: string[];
        sensitiveFiles: string[];
    };

    documentation: {
        score: {
            score: number;
            rating: string;
        };
    };

    intelligence: {
        summary: string;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
        grade: string;
        maturity: string;
        verdict: string;
        roadmap: string[];
    };
}