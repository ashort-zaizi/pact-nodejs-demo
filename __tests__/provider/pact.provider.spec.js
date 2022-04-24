const path = require("path")
const { Verifier } = require("@pact-foundation/pact")
const { server, importData } = require("../../src/provider")
require('dotenv').config()

jest.setTimeout(30000);

describe("Users Service Pact verification", () => {

    // Start real provider server
    const port = 8081
    beforeAll(async () => {
        server.listen(port, () => {
            importData()
            console.log(`Provider listening on http://localhost:${port}`)
        })
    })

    let opts = {
        provider: "user-service-provider",
        logLevel: "INFO",
        providerBaseUrl: `http://localhost:${port}`,
        pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
        pactBrokerToken: process.env.PACT_BROKER_TOKEN,
        publishVerificationResult: true,
        consumerVersion: "1.0.0",
        providerVersion: "1.0.0"
    }

    it("validates the expectations of the users service", () => {

        return new Verifier(opts).verifyProvider().then(output => {
            console.log("Pact Verification Complete!")
            console.log(output)
        })
    })

})
