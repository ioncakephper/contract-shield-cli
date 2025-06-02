const { execSync } = require('child_process');
const colors = require('ansi-colors');

describe('contracts-shield-cli transpile', () => {
  test('runs transpile command without errors', () => {
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
});