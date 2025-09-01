# Release Setup Documentation

## NPM Token Configuration

To enable automated npm publishing for `@plenarc/specment`, you need to configure the `NPM_TOKEN` secret in GitHub repository settings.

### Step 1: Generate NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
1. Go to your profile settings → Access Tokens
1. Click "Generate New Token" → "Automation"
1. Copy the generated token (it starts with `npm_`)

### Step 2: Configure GitHub Secret

1. Go to your GitHub repository
1. Navigate to Settings → Secrets and variables → Actions
1. Click "New repository secret"
1. Name: `NPM_TOKEN`
1. Value: Paste the npm token from Step 1
1. Click "Add secret"

### Step 3: Verify Package Scope Access

Ensure your npm account has publish access to the `@plenarc` scope:

```bash
# Check if you have access to the scope
npm access list packages @plenarc

# If the scope doesn't exist, create it
npm access grant read-write @plenarc:developers <your-npm-username>
```

## Release Process

### Automated Release (Recommended)

1. Create a changeset for your changes:
   ```bash
   pnpm changeset
   ```

1. Commit and push to a feature branch:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature-branch
   ```

1. Create a Pull Request to `main` branch

1. When the PR is merged, the release workflow will:
   - Create a "Version Packages" PR with updated versions and CHANGELOG
   - When that PR is merged, automatically publish to npm
   - Create a GitHub release with release notes

### Manual Release

If you need to publish manually:

```bash
# 1. Version packages
pnpm changeset:version

# 2. Build packages
pnpm specment:build

# 3. Publish to npm
pnpm changeset:publish
```

## Changeset Configuration

The release workflow uses the configuration in `.changeset/config.json`:

- **baseBranch**: `develop` - Base branch for changesets
- **access**: `public` - Packages are published as public
- **ignore**: `["@specment/docs"]` - Docs package is not published to npm

## Workflow Triggers

The release workflow (`release.yml`) runs on:

- **Push to main**: Automatically checks for changesets and publishes if needed
- **Manual trigger**: Can be triggered manually from GitHub Actions tab

## Troubleshooting

### Common Issues

1. **NPM_TOKEN not working**
   - Verify the token has "Automation" permissions
   - Check if the token has access to `@plenarc` scope
   - Ensure the token hasn't expired

1. **Package not publishing**
   - Check if there are pending changesets: `pnpm changeset:status`
   - Verify the package builds successfully: `pnpm specment:build`
   - Check GitHub Actions logs for detailed error messages

1. **Version conflicts**
   - Ensure the version in `package.json` matches the changeset expectations
   - Check if the package already exists on npm with the same version

### Logs and Debugging

- GitHub Actions logs: Repository → Actions → Release workflow
- npm publish logs: Available in the workflow step outputs
- Changeset status: `pnpm changeset:status`
