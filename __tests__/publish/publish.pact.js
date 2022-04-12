const pact = require('@pact-foundation/pact-node');
const path = require("path")
require('dotenv').config()

const gitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

// Used for publishing Paxt contract to PactFlow
const opts = {
    pactFilesOrDirs: [path.resolve(__dirname, '../pacts/')],
    pactBroker: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    // consumerVersion: gitHash
    consumerVersion: "1.0.0"
}

pact
    .publishPacts(opts)
    .then(() => {
        console.log("Pact published successfully")
        console.log("Login to https://zaizi.pactflow.io")
        console.log("to view the published contract")
    }).catch(e => {
        console.log("Pact contract publishing failed: ", e)
    })
