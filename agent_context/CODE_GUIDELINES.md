# Strict Code Generation Guidelines

This document outlines the stricter rules for generating code to ensure that code snippets remain within manageable limits and are easily maintainable. These guidelines are especially important when using code generation tools like Copilot.

## 1. Code Generation Limits
- **Modular Code:** Generate code in small, self-contained modules rather than large monolithic blocks.
- **Context Window Management:** Avoid generating files or functions that exceed a few hundred lines. If more is needed, break the code into separate files or components.
- **Single Responsibility:** Each module or function should have a single clear responsibility to minimize dependencies and reduce context complexity.

## 2. Documentation & Comments
- **Inline Comments:** Include concise comments that explain the purpose of complex sections of code.
- **Function Headers:** Every function should have a header comment describing its purpose, inputs, outputs, and any side effects.
- **Readability:** Ensure code formatting is consistent and follows established style guides (e.g., Prettier, ESLint).

## 3. Code Reuse & Modularity
- **Component-Based Design:** For frameworks like Next.js, use reusable components to keep codebases small and modular.
- **Avoid Duplication:** Factor out repeated code into utility functions or shared components.
- **Library Utilization:** When possible, leverage existing libraries or frameworks rather than reinventing functionality.

## 4. Code Reviews & Iteration
- **Incremental Changes:** Generate and review code in small increments to facilitate easier debugging and integration.
- **Peer Review:** All generated code should undergo peer review or automated code analysis before being merged.
- **Refactoring:** Regularly refactor code to reduce redundancy and maintain a clear separation of concerns.
