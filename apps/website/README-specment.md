# Specment Dogfooding Guide

[English](README-specment.md) | [日本語](README-specment-jp.md)

> **📖 Project Overview**: [About Specment](../../README.md) - Complete value proposition, usage patterns, and quick start guide
>
> **🔧 CLI Reference**: [CLI Tool Documentation](../../packages/specment/README.md) - Installation, commands, and configuration options

This document demonstrates real-world Specment usage through this project's own documentation workflow.

## Overview

The apps/website project uses the @plenarc/specment tool for document management. This enables consistent document creation and validation.

## Setup

The specment tool is already integrated into the project and can be used with the following npm scripts:

```bash
# Display template list
pnpm spec:list --templates

# Create new document
pnpm spec:create

# Validate documents
pnpm spec:validate

# Display project structure
pnpm spec:list
```

## Available Templates

The following templates are currently available:

### 1. functional-requirement

1. Template for functional requirement documents
1. Location: `docs/02-requirements/functional/`
1. Naming convention: `req-XXX.mdx`

### 2. non-functional-requirement

1. Template for non-functional requirement documents
1. Location: `docs/02-requirements/non-functional/`
1. Naming convention: `nfr-XXX.mdx`

### 3. screen-specification

1. Template for screen specification documents
1. Location: `docs/04-internal/screens/`
1. Naming convention: `screen-XXX.mdx`

### 4. table-specification

1. Template for table specification documents
1. Location: `docs/04-internal/tables/`
1. Naming convention: `table-XXX.mdx`

## Usage

### Creating New Documents

```bash
pnpm spec:create
```

Running this command displays an interactive prompt where you can select:

1. Template to use
1. File name
1. Category to place

### Document Validation

```bash
pnpm spec:validate
```

This command checks the following:

1. Presence of frontmatter
1. Compliance with naming conventions
1. Category structure consistency

### Project Structure Check

```bash
pnpm spec:list
```

Displays the current document structure in tree format.

## Configuration File

You can customize specment behavior with the `specment.config.json` file:

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec",
  "categories": {
    "overview": {
      "path": "01-overview",
      "description": "Project overview and context documents"
    },
    "requirements": {
      "path": "02-requirements", 
      "description": "Functional and non-functional requirements"
    },
    "external": {
      "path": "03-external",
      "description": "External interfaces and business models"
    },
    "internal": {
      "path": "04-internal",
      "description": "Internal system specifications"
    }
  },
  "validation": {
    "rules": [
      "markdown-lint",
      "frontmatter-required",
      "category-structure",
      "naming-convention"
    ]
  },
  "naming": {
    "pattern": "flexible",
    "allowedPatterns": ["kebab-case", "snake_case", "underscore-prefix"],
    "exceptions": [
      "_*",
      "customer_details",
      "*_template"
    ]
  }
}
```

## Consistency with Existing Structure

The specment tool is configured to maintain consistency with the existing document structure:

1. Underscore prefix (`_assumptions-constraints.mdx` etc.) allowed as exceptions
1. Snake case (`customer_details.mdx` etc.) also allowed
1. Template files (`*_template.mdx`) allowed as exceptions

## Best Practices

### Use templates

Always use templates when creating new documents

### Regular validation

Run `pnpm spec:validate` before committing

### Follow naming conventions

Use kebab-case for new files

### Include frontmatter

All documents should include frontmatter

## Troubleshooting

### When Validation Errors Occur

1. Check if file names follow naming conventions
1. Check if frontmatter is correctly written
1. Check if placed in appropriate category

### When Templates Are Not Found

1. Check if `templates/` directory exists
1. Check if template files are saved with `.mdx` extension
1. Check `templatesDir` setting in `specment.config.json`

## Future Extensions

1. Automatic document generation
1. More detailed validation rules
1. Custom template additions
1. Enhanced Docusaurus integration