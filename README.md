# contract-shield-cli  

A CLI tool that verifies preconditions, postconditions, and invariants in contracts without altering their original source code. `contract-shield-cli` enforces Design by Contract principles externally, ensuring contracts behave as expected while preserving their integrity.  

## Features  
- **Precondition Validation (`@pre`)** – Ensures input conditions are met before execution.  
- **Postcondition Verification (`@post`)** – Confirms expected results after execution.  
- **Invariant Checking (`@invariant`)** – Maintains logical consistency across operations.  
- **Source Code Integrity** – Works externally without modifying the original code.  

## Installation  
To install `contract-shield-cli`, use:  

```sh
npm install -g contract-shield-cli
```

## Example
Given the following contract source code:

```js
/**
 * Example function with validation tags
 * @pre amount > 0
 * @post balance == previousBalance - amount
 * @post balance >= 0
 */
function withdraw(amount) {
}
```
The tool will generate a modified version of the contract that enforces these conditions

## Contributing
- Fork the repository.
- Create a feature branch (git checkout -b feature-branch).
- Commit changes (git commit -m "Add feature").
- Push to GitHub (git push origin feature-branch).
- Open a Pull Request.


## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

