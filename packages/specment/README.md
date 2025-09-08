# @plenarc/specment

[![npm version](https://badge.fury.io/js/@plenarc%2Fspecment.svg)](https://badge.fury.io/js/@plenarc%2Fspecment)
[![npm downloads](https://img.shields.io/npm/dm/@plenarc/specment.svg)](https://www.npmjs.com/package/@plenarc/specment)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI tool for managing specification documents and templates.

## Installation

```bash
npm install -g @plenarc/specment
```

## Usage

### Basic Commands

```bash
# Initialize a new specification project
specment init

# Create a new specification document
specment create <template-name>

# List available templates
specment list

# Generate documentation from specifications
specment generate

# Migrate existing specifications
specment migrate <version>
```

### Examples

```bash
# Initialize a new project with default templates
specment init my-project

# Create a new API specification
specment create api-spec

# Generate HTML documentation
specment generate --format html

# List all available templates
specment list --templates
```

## Templates

Specment comes with built-in templates for common specification types:

- **api-spec**: REST API specification template
- **feature-spec**: Feature specification template
- **design-doc**: Design document template
- **user-story**: User story template

## Configuration

Specment can be configured using a `specment.config.json` file in your project root:

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec"
}
```

## Development

This package is part of the Specment monorepo. For development instructions, see the main repository README.

## License

MIT
