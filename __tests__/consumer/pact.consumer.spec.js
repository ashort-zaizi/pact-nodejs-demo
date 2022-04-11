const { Matchers, Publisher } = require("@pact-foundation/pact")
const Pact = require("@pact-foundation/pact").Pact
const { getClients, postClient } = require("../../src/consumer")
const path = require("path")


const mockProvider = new Pact({
    port:8081,
    log: path.resolve(process.cwd(), "__tests__/logs", "mock-provider.log"), // log file location and name
    dir: path.resolve(process.cwd(), "__tests__/pacts"), // location where pact contract will be saved
    spec: 2,
    logLevel: 'INFO',
    pactfileWriteMode: "overwrite",
    consumer: "pact-consumer",
    provider: "pact-provider"
 })

 describe("Consumer Pact Tests", () => {
    beforeAll(() => mockProvider.setup());  // Start the Mock Server and wait for it to be available
    afterEach(() => mockProvider.verify()); // Verifies that all interactions specified
    afterAll(() => mockProvider.finalize()); // Records the interactions between the Mock Server into the pact file and shuts it down

    describe('retrieve clients', () => {
 
        test('clients exist', async () => {
  
            // Setup Pact interactions
            EXPECTED_RESP_BODY = [{
                "firstName": "Lisa",
                "lastName": "Simpson",
                "age": 8,
                "id": 1
            },
            {
                "firstName": "Wonder",
                "lastName": "Woman",
                "age": 30,
                "id": 2
            },
            {
                "firstName": "Homer",
                "lastName": "Simpson",
                "age": 39,
                "id": 3
            }]
   
            await mockProvider.addInteraction({
                state: "i have a list of clients",
                uponReceiving: "a request for all clients",
                withRequest: {
                    method: "GET",
                    path: "/clients",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: EXPECTED_RESP_BODY,
                }
            })

            // make request to the Pact mock server
            const response = await getClients()
 
            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            expect(response.data).toEqual(EXPECTED_RESP_BODY)
            expect(response.status).toEqual(200)
  
        })
    })
 })

