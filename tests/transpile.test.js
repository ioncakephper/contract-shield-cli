const { execSync } = require('child_process');
const colors = require('ansi-colors');
const packageJson = require('../package.json');

describe('contracts-shield-cli transpile', () => {
  test('runs default transpile command without errors', () => {
    const output = execSync('node src/cli.js').toString();
    expect(output).toContain(colors.green('Starting transpilation process...'));
  });

  test('transpile command explicitly runs without errors', () => {
    const output = execSync('node src/cli.js transpile').toString();
    expect(output).toContain(colors.green('Starting transpilation process...'));
  });

  test('filters validation with specified patterns', () => {
    const output = execSync('node src/cli.js transpile precondition invariant').toString();
    expect(output).toContain(colors.cyan('Filtering validations using patterns: precondition, invariant'));
  });

  test('silent mode suppresses output', () => {
    const output = execSync('node src/cli.js transpile --silent').toString();
    expect(output.trim()).toBe('');
  });

  test('silent mode with patterns suppresses output', () => {
    const output = execSync('node src/cli.js transpile precondition invariant --silent').toString();
    expect(output.trim()).toBe('');
  });

  test('loads version from package.json', () => {
    const output = execSync('node src/cli.js --version').toString().trim();
    expect(output).toBe(packageJson.version || '0.0.1');
  });

});