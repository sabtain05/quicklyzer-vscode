# Quicklyzer

**Project Intelligence Dashboard for Visual Studio Code.**

Quicklyzer is a powerful, offline-first analysis tool that deeply inspects your software projects. It transforms complex codebase metrics into a clean, professional dashboard directly inside your VS Code environment.

![Quicklyzer Logo](https://raw.githubusercontent.com/sabtain05/quicklyzer/main/resources/quicklyzer.png)

## Features

Quicklyzer runs a comprehensive scan of your active workspace and generates an interactive report across more than a dozen critical categories:

*   **Architecture & Performance:** Identify heavy files, import density, circular dependencies, and dead modules.
*   **Security & Health:** Scan for dangerous files, exposed secrets, and overall repository health.
*   **Testing & Build:** Evaluate test coverage, readiness, build system maturity, and optimization opportunities.
*   **API & Dependencies:** Map out endpoints, middleware, GraphQL/WebSocket usage, and dependency risks.
*   **AI Intelligence:** Receive a calculated project grade, maturity rating, and an automated assessment of your project's strengths and weaknesses.

## Usage

1. Open your software project folder in VS Code.
2. Click on the **Quicklyzer** icon in the Activity Bar (Sidebar).
3. Click the **Analyze Project** button.
4. Review your project's health and metrics in the generated dashboard panel.

## Requirements

*   **Node.js**: Requires Node.js `>=20.0.0` installed on your system.
*   **VS Code**: Version `1.120.0` or higher.

## Known Issues

*   Analysis time scales with the size of the project and the depth of the dependency tree (`node_modules`). Extremely large monorepos may take slightly longer to process.

## Release Notes

See the [CHANGELOG.md](CHANGELOG.md) for details on the latest updates.

---

**A Sabtain Ali production**
