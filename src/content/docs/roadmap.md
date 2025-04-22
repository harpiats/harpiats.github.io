---
title: Development Roadmap
description: Current development progress and future plans
---

## Current Version
**v1.0.0-beta.4** - Beta testing phase

## Current Focus

### 1. Unit Testing Implementation
We're building a comprehensive test suite to ensure framework stability:
- Using Bun's built-in test runner
- Implementing code coverage reports
- Developing mocking utilities for all core features

### 2. Performance Benchmarking
- Comparing against Node.js frameworks
- Measuring startup time improvements
- Analyzing memory usage patterns

## Next Major Goal: Runtime Adapter

After stable v1.0 release, we'll focus on runtime flexibility:

**Key aspects:**
- Abstract server creation to support multiple runtimes
- Maintain Bun as default optimized runtime
- Node.js compatibility will require:
  - Node's native http module adaptation
  - Compatibility layer for Bun-specific features
  - Code transpilation to JavaScript for production use

## Future Plans

### Developer Experience
- Enhanced error messages
- Debugging tools integration
- Production monitoring support

## Community Contributions
We welcome help with:
- Test case development
- Documentation improvements
- Compatibility research

```bash
# Contribute to the project:
git clone https://github.com/harpiats/core
cd your-repo
bun install
bun test
```

## Version Support

| Version       | Status          | Support               |
|---------------|-----------------|-----------------------|
| v1.x          | Stable          | Full support          |
| v1.0.0-beta.x | Beta Testing    | Active development    |
| v0.x          | Deprecated      | Security fixes only   |
