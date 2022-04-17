const path = require("path")
const { Verifier } = require("@pact-foundation/pact")
const { server, importData } = require("../../src/provider")
require('dotenv').config()

jest.setTimeout(30000);

describe("Clients Service Pact verification", () => {

    const port = 8081
    let opts = {
        provider: "client-service-provider",
        logLevel: "INFO",
        providerBaseUrl: `http://localhost:${port}`,
        pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
        pactBrokerToken: process.env.PACT_BROKER_TOKEN,
        publishVerificationResult: true,
        consumerVersion: "1.0.0",
        providerVersion: "1.0.0"
    }

    // Start real provider server
    beforeAll(async () => {
        server.listen(port, () => {
            importData()
            console.log(`Provider listening on http://localhost:${port}`)
        })
    })

    it("validates the expectations of the clients service", () => {

        return new Verifier(opts).verifyProvider().then(output => {
            console.log("Pact Verification Complete!")
            console.log(output)
        })
    })

})
