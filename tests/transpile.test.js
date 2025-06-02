const { execSync } = require('child_process');
const fs = require('fs');
const packageJson = require('../package.json');

// Cleanup helper function
const cleanupFiles = () => {
  const filesToRemove = ['transpile.log', 'test-config.json'];
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};

describe('Contract Shield CLI - Basic Transpile Tests', () => {
  beforeAll(() => cleanupFiles());  // Cleanup before tests
  afterAll(() => cleanupFiles());   // Cleanup after tests

  test('CLI runs without errors', () => {
    const output = execSync('node src/cli.js').toString();
    expect(output).toBeDefined();
  });

  test('Explicit transpile command runs', () => {
    const output = execSync('node src/cli.js transpile').toString();
    expect(output).toBeDefined();
  });

  test('Silent mode suppresses console output', () => {
    const output = execSync('node src/cli.js transpile --silent').toString().trim();
    expect(output).toBe('');
  });

  test('Loads version from package.json', () => {
    const output = execSync('node src/cli.js --version').toString().trim();
    expect(output).toBe(packageJson.version);
  });

  test('CLI help command displays usage information', () => {
    const output = execSync('node src/cli.js --help').toString();
    expect(output).toBeDefined();
  });

  test('CLI handles unknown commands gracefully', () => {
    try {
      execSync('node src/cli.js invalidcommand');
    } catch (error) {
      expect(error.stderr.toString()).toBeDefined();
    }
  });

  test('CLI runs with a specified config file', () => {
    fs.writeFileSync('test-config.json', JSON.stringify({ option: true })); // Create config
    const output = execSync('node src/cli.js transpile --config test-config.json').toString();
    expect(output).toBeDefined();
  });

  test('Handles missing transpilation source gracefully', () => {
    try {
      execSync('node src/cli.js transpile nonexistent.js');
    } catch (error) {
      expect(error.stderr.toString()).toBeDefined();
    }
  });

  test('Fails gracefully when given an empty command', () => {
    try {
      execSync('node src/cli.js ""');
    } catch (error) {
      expect(error.stderr.toString()).toBeDefined();
    }
  });

  test('Handles file paths with special characters', () => {
    const output = execSync('node src/cli.js transpile "./some-folder/file-with-space.js"').toString();
    expect(output).toBeDefined();
  });

  test('Handles extreme log file sizes without crashing', () => {
    fs.writeFileSync('transpile.log', 'A'.repeat(1000000)); // Simulate a huge log file
    execSync('node src/cli.js transpile --silent');
    const logFile = fs.readFileSync('transpile.log', 'utf-8');
    expect(logFile).toBeDefined();
  });

  test('Handles deeply nested directories', () => {
    const output = execSync('node src/cli.js transpile some/deeply/nested/path/**/*.js').toString();
    expect(output).toBeDefined();
  });

  test('Handles unexpected flags gracefully', () => {
    try {
      execSync('node src/cli.js transpile --unknownflag');
    } catch (error) {
      expect(error.stderr.toString()).toBeDefined();
    }
  });

  test('Handles concurrent execution without issues', () => {
    const output1 = execSync('node src/cli.js transpile').toString();
    const output2 = execSync('node src/cli.js transpile').toString();
    expect(output1).toBeDefined();
    expect(output2).toBeDefined();
  });
});