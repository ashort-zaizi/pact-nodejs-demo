const path = require("path")
const { Verifier } = require("@pact-foundation/pact")
const { server, importData } = require("../../src/provider")
require('dotenv').config()

const SERVER_URL = "http://localhost:8081"

// Start real provider server
server.listen(8081, () => {
    importData()
    console.log(`Provider listening on ${SERVER_URL}`)
})

describe("Clients Service verification", () => {

    it("validates the expectations of the clients service", () => {
        let opts = {
            provider: "Clients Service",
            logLevel: "DEBUG",
            providerBaseUrl: SERVER_URL,
            pactUrls: [path.resolve(process.cwd(), "./__tests__/pacts/pact-consumer-pact-provider.json")],
            // pactBrokerUrl: process.env.PACT_BROKER_URL,
            // pactBrokerToken: process.env.PACT_TOKEN,
            consumerVersionTags: ["pact-consumer"],
            providerVersionTags: ["pact-provider"],
            publishVerificationResult: false,
            providerVersion: "1.0.0"
        }
        return new Verifier(opts).verifyProvider().then(output => {
            console.log("Pact Verification Complete!")
            console.log(output)
        })
    })
})
