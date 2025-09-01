#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
const program = new Command();
program
    .name('specment')
    .description('A CLI tool for managing specification documents and templates')
    .version('0.1.4');
// Load configuration
async function loadConfig() {
    const configPath = path.join(process.cwd(), 'specment.config.json');
    if (await fs.pathExists(configPath)) {
        return await fs.readJson(configPath);
    }
    return {
        templatesDir: './templates',
        outputDir: './docs',
        defaultTemplate: 'feature-spec'
    };
}
program
    .command('init')
    .description('Initialize a new specification project')
    .action(async () => {
    console.log(chalk.green('✓ Initializing new specification project...'));
    const config = {
        templatesDir: './templates',
        outputDir: './docs',
        defaultTemplate: 'feature-spec',
        validation: {
            rules: ['markdown-lint', 'frontmatter-required']
        }
    };
    await fs.ensureDir('templates');
    await fs.writeJson('specment.config.json', config, { spaces: 2 });
    console.log(chalk.green('✓ Created specment.config.json'));
    console.log(chalk.green('✓ Created templates directory'));
    console.log(chalk.blue('📝 Project initialized successfully!'));
});
program
    .command('create')
    .description('Create a new specification document from template')
    .argument('[template]', 'Template name to use')
    .option('-o, --output <path>', 'Output file path')
    .option('-c, --category <category>', 'Document category')
    .action(async (template, options) => {
    console.log(chalk.blue('📝 Creating new specification document...'));
    const config = await loadConfig();
    const templatesDir = path.join(process.cwd(), config.templatesDir);
    // List available templates
    if (await fs.pathExists(templatesDir)) {
        const templates = await fs.readdir(templatesDir);
        const templateFiles = templates.filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
        if (templateFiles.length > 0) {
            console.log(chalk.green('Available templates:'));
            templateFiles.forEach(t => console.log(`  - ${t.replace(/\.(mdx?|md)$/, '')}`));
        }
    }
    if (!template) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Select a template:',
                choices: [
                    'functional-requirement',
                    'non-functional-requirement',
                    'screen-specification',
                    'table-specification'
                ]
            },
            {
                type: 'input',
                name: 'filename',
                message: 'Enter filename (without extension):',
                validate: (input) => input.length > 0 || 'Filename is required'
            },
            {
                type: 'list',
                name: 'category',
                message: 'Select category:',
                choices: [
                    '02-requirements/functional',
                    '02-requirements/non-functional',
                    '04-internal/screens',
                    '04-internal/tables'
                ]
            }
        ]);
        template = answers.template;
        options.output = `${config.outputDir}/${answers.category}/${answers.filename}.mdx`;
    }
    const templatePath = path.join(templatesDir, `${template}.mdx`);
    if (await fs.pathExists(templatePath)) {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const outputPath = options.output || `${config.outputDir}/${template}-new.mdx`;
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, templateContent);
        console.log(chalk.green(`✓ Created ${outputPath}`));
    }
    else {
        console.log(chalk.red(`✗ Template ${template} not found`));
    }
});
program
    .command('list')
    .description('List available templates and documents')
    .option('-t, --templates', 'List templates only')
    .action(async (options) => {
    const config = await loadConfig();
    if (options.templates) {
        console.log(chalk.blue('📋 Available templates:'));
        const templatesDir = path.join(process.cwd(), config.templatesDir);
        if (await fs.pathExists(templatesDir)) {
            const templates = await fs.readdir(templatesDir);
            const templateFiles = templates.filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
            templateFiles.forEach(template => {
                console.log(`  ${chalk.green('✓')} ${template.replace(/\.(mdx?|md)$/, '')}`);
            });
        }
    }
    else {
        console.log(chalk.blue('📋 Project structure:'));
        const docsDir = path.join(process.cwd(), config.outputDir);
        if (await fs.pathExists(docsDir)) {
            await listDirectory(docsDir, '');
        }
    }
});
async function listDirectory(dir, prefix) {
    const items = await fs.readdir(dir);
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = await fs.stat(itemPath);
        if (stat.isDirectory()) {
            console.log(`${prefix}📁 ${item}/`);
            await listDirectory(itemPath, prefix + '  ');
        }
        else if (item.endsWith('.mdx') || item.endsWith('.md')) {
            console.log(`${prefix}📄 ${item}`);
        }
    }
}
program
    .command('validate')
    .description('Validate specification documents')
    .option('-f, --fix', 'Auto-fix issues where possible')
    .action(async (options) => {
    console.log(chalk.yellow('🔍 Validating documents...'));
    const config = await loadConfig();
    const docsDir = path.join(process.cwd(), config.outputDir);
    let issueCount = 0;
    if (await fs.pathExists(docsDir)) {
        issueCount = await validateDirectory(docsDir, config, options.fix);
    }
    if (issueCount === 0) {
        console.log(chalk.green('✓ All documents are valid!'));
    }
    else {
        console.log(chalk.yellow(`⚠ Found ${issueCount} issues`));
    }
});
async function validateDirectory(dir, config, fix) {
    const items = await fs.readdir(dir);
    let issueCount = 0;
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = await fs.stat(itemPath);
        if (stat.isDirectory()) {
            issueCount += await validateDirectory(itemPath, config, fix);
        }
        else if (item.endsWith('.mdx') || item.endsWith('.md')) {
            issueCount += await validateFile(itemPath, config, fix);
        }
    }
    return issueCount;
}
async function validateFile(filePath, config, fix) {
    const content = await fs.readFile(filePath, 'utf-8');
    let issueCount = 0;
    // Check for frontmatter
    if (!content.startsWith('---')) {
        console.log(chalk.yellow(`⚠ ${filePath}: Missing frontmatter`));
        issueCount++;
    }
    // Check naming convention
    const filename = path.basename(filePath, path.extname(filePath));
    if (config.naming && config.naming.pattern === 'kebab-case') {
        if (!/^[a-z0-9-]+$/.test(filename)) {
            console.log(chalk.yellow(`⚠ ${filePath}: Filename should use kebab-case`));
            issueCount++;
        }
    }
    return issueCount;
}
program
    .command('generate')
    .description('Generate documentation from templates')
    .option('-f, --format <format>', 'Output format (html, pdf)', 'html')
    .action(async (options) => {
    console.log(chalk.blue('📝 Generating documentation...'));
    console.log(`Format: ${options.format}`);
    console.log('This feature will integrate with Docusaurus build process');
});
program.parse();
//# sourceMappingURL=index.js.map