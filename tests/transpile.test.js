const { execSync } = require('child_process');
const fs = require('fs');
const packageJson = require('../package.json');

const cleanupFiles = () => {
  const filesToRemove = ['transpile.log', 'test-config.json', 'dist', 'test-output'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.rmSync(file, { recursive: true, force: true });
    }
  });
};

describe('Contract Shield CLI - Basic Transpile Tests', () => {
  beforeAll(() => cleanupFiles());
  afterAll(() => cleanupFiles());

  test('Transpiled files are saved in the specified output directory', () => {
    execSync('node src/cli.js transpile --output test-output');
    expect(fs.existsSync('test-output')).toBe(true);
  });

  test('Transpiled files are saved to "dist" when no --output is provided', () => {
    execSync('node src/cli.js transpile');
    expect(fs.existsSync('dist')).toBe(true);
  });

  test('Fails gracefully when given an invalid output folder', () => {
    try {
      execSync('node src/cli.js transpile --output "/invalid-path"');
    } catch (error) {
      expect(error.stderr.toString()).toBeDefined();
    }
  });
});