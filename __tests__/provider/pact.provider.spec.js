const path = require("path")
const { Matchers, Verifier } = require("@pact-foundation/pact")
const { server, importData } = require("../../src/provider")
require('dotenv').config()
const SERVER_URL = "http://localhost:8081"

// Start real provider server
server.listen(8081, () => {
    importData()
    console.log(`Provider listening on ${SERVER_URL}`)
})

describe("Get Clients verification", () => {

    it("validates the expectations of the get clients service", () => {
        let opts = {
            provider: "Get Clients Service",
            logLevel: "DEBUG",
            providerBaseUrl: SERVER_URL,
            // pactUrls: [path.resolve(procecss.cwd(), "./__tests__/pacts/pact-consumer-pact-provider.json")],

            // pactBrokerUrl: process.env.PACT_BROKER_URL,
            pactBrokerUrl: "https://zaizi.pactflow.io/",
            pactBrokerToken: "1iB-FQbUuvpxce6QX-DBTQ",
            // pactBrokerToken: process.env.PACT_TOKEN,
            // pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
            // pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',

            // pactBrokerToken: process.env.PACT_TOKEN,
            // consumerVersionTags: ["pact-consumer"],
            // providerVersionTags: ["pact-provider"],
            providerVersion: "1.0.0"
        }
        return new Verifier(opts).verifyProvider().then(output => {
        console.log("Pact Verification Complete!")
        console.log(output)
        })
    })
})
