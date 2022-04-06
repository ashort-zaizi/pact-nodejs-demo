// "use strict"

const { Matchers } = require("@pact-foundation/pact")
const Pact = require("@pact-foundation/pact").Pact
const { getClients, postClient } = require("../../src/consumer")
const path = require("path")


const mockProvider = new Pact({
  port: 8081,
  log: path.resolve(process.cwd(), "__tests__/logs", "mockserver-integration.log"),
  dir: path.resolve(process.cwd(), "__tests__/pacts"),
  spec: 2,
  logLevel: 'INFO',
  pactfileWriteMode: "overwrite",
  consumer: "pact-consumer",
  provider: "pact-provider",
})

describe("Pact tests", () => {
    beforeAll(() => mockProvider.setup());
    afterEach(() => mockProvider.verify());
    afterAll(() => mockProvider.finalize());

    describe('retrieve clients', () => {

        test('clients exist', async () => {

            // Setup Pact interactions
            const GET_EXPECTED_BODY = [{
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
                    body: GET_EXPECTED_BODY,
                }
            })

            // make request to the Pact mock server
            const response = await getClients()

            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            expect(response.data).toEqual(GET_EXPECTED_BODY)
            expect(response.status).toEqual(200)
        })
    })
    
})