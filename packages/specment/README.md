# @plenarc/specment

[English](README.md) | [日本語](README-jp.md)

CLI development tools for Specment - a repository-based solution for creating specification sites with markdown (MDX) and managing specifications with Git.

> **📖 Project Overview**: [About Specment](../../README.md) - Complete value proposition, usage patterns, and quick start guide

## Installation

> **Prerequisites**: See [system requirements](../../README.md#prerequisites) in the main README for Node.js and package manager setup.

### Global Installation

```bash
npm install -g @plenarc/specment
```

### Project-level Installation

```bash
# Using npm
npm install --save-dev @plenarc/specment

# Using pnpm (recommended)
pnpm add -D @plenarc/specment

# Using yarn
yarn add --dev @plenarc/specment
```

### Installation Verification

```bash
# Check version
specment --version

# Show help
specment --help
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

### Basic Examples

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

### Advanced Usage Examples

#### Customizing Project Initialization

```bash
# Initialize with specific template directory
specment init my-project --template-dir ./custom-templates

# Initialize with specific output directory
specment init my-project --output-dir ./specifications

# Initialize with custom configuration file
specment init my-project --config ./custom-config.json
```

#### Multi-format Documentation Generation

```bash
# Generate HTML format
specment generate --format html --output ./dist/html

# Generate PDF format (requires additional setup)
specment generate --format pdf --output ./dist/pdf

# Generate multiple formats simultaneously
specment generate --format html,pdf --output ./dist
```

#### Template Management

```bash
# Add custom template
specment template add ./my-custom-template

# Show template details
specment template info api-spec

# Remove template
specment template remove custom-template
```

#### Batch Processing

```bash
# Batch create multiple specifications
specment batch create --templates api-spec,feature-spec --count 5

# Validate all specifications in directory
specment validate --recursive ./specs

# Generate multiple output formats based on configuration
specment generate --config-based
```

## Templates

Specment comes with built-in templates for common specification types:

- **api-spec**: REST API specification template
- **feature-spec**: Feature specification template
- **design-doc**: Design document template
- **user-story**: User story template

### Creating Custom Templates

```bash
# Create a new template
specment template create my-template

# Create based on existing template
specment template create my-template --base feature-spec
```

## Configuration

Specment can be configured using a `specment.config.json` file in your project root:

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec",
  "validation": {
    "enabled": true,
    "rules": ["required-sections", "format-check"]
  },
  "generation": {
    "formats": ["html"],
    "theme": "default",
    "customCss": "./styles/custom.css"
  }
}
```

### Configuration Options

| Option               | Description                    | Default Value  |
| -------------------- | ------------------------------ | -------------- |
| `templatesDir`       | Path to templates directory    | `./templates`  |
| `outputDir`          | Path to output directory       | `./docs`       |
| `defaultTemplate`    | Default template name          | `feature-spec` |
| `validation.enabled` | Enable/disable validation      | `true`         |
| `generation.formats` | Array of generation formats    | `["html"]`     |

## Examples and Detailed Information

### Real-world Usage Examples

This Specment project itself serves as a real-world example of CLI tool usage:

**🔗 [Practical Usage Guide](../../apps/website/README-specment.md)** - How to operate a documentation site using Specment

### Comprehensive Documentation

**🌐 [Specment Official Site](https://plenarc.github.io/specment/)** - Comprehensive usage methods and best practices

## Development

This package is part of the Specment monorepo. For development instructions, see the [main repository README](../../README.md).
