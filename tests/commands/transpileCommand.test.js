const fs = require('fs');
const { execSync } = require('child_process');

describe('transpileCommand CLI', () => {
  beforeAll(() => {
    // Create a test config file before running the tests
    fs.writeFileSync('test-config.json', JSON.stringify({ option: true }));
  });

  afterAll(() => {
    // Clean up the test config file after tests are done
    fs.unlinkSync('test-config.json');
  });

  test('CLI runs with a specified config file', () => {
    const output = execSync('node src/cli.js transpile --config test-config.json').toString();
    expect(output).toBeDefined();
  });
});