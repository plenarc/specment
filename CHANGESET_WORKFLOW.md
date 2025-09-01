# Changeset Workflow for Specment Monorepo

## Overview

This monorepo uses Changesets to manage versioning and publishing of packages. The configuration is set up to handle the workspace structure with proper dependency management.

## Configuration

- **Access**: Public packages (can be published to npm)
- **Base Branch**: main
- **Ignored Packages**: @specment/docs (documentation app, not published)
- **Internal Dependencies**: Patch updates for workspace dependencies

## Workflow

### 1. Making Changes

When you make changes to any package in the workspace:

```bash
# After making your changes, create a changeset
pnpm changeset
```

This will:
- Prompt you to select which packages have changed
- Ask for the type of change (major, minor, patch)
- Request a summary of the changes

### 2. Version Bumping

When ready to release:

```bash
# Update package versions based on changesets
pnpm changeset:version
```

This will:
- Update package.json versions
- Update CHANGELOG.md files
- Remove consumed changeset files

### 3. Publishing

```bash
# Publish updated packages
pnpm changeset:publish
```

### 4. Status Check

```bash
# Check current changeset status
pnpm changeset:status
```

## Package Structure

- `@plenarc/specment` - Main CLI package (published)
- `@specment/docs` - Documentation app (ignored, not published)

## Best Practices

1. Always create a changeset for user-facing changes
2. Use semantic versioning appropriately:
   - **patch**: Bug fixes, internal improvements
   - **minor**: New features, backwards compatible
   - **major**: Breaking changes
3. Write clear, user-focused changeset summaries
4. Review generated CHANGELOGs before publishing