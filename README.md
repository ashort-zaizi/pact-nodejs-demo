A simple Nodejs + Jest project configuring contract tests with PactJS
<br>
<br>

## Running via CLI

- Open your terminal on your project's folder

- Install Node packages:
`npm install`

- Run the consumer contract tests (Generate the contracts):
`npm run test:consumer`

- Run the provider contract tests (Verify the contracts):
`npm run test:provider`

- Run the provider server  `http://localhost:8081`  (User API/Service):
`npm run provider`

- Run the consumer server `http://localhost:8080` (User API/Service):
`npm run consumer`

- Publish the contracts:
`npm run publish:contract`

1. npm install
2. npm install --save-dev @pact-foundation/pact
