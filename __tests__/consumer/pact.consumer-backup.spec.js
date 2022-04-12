const { Matchers, Publisher } = require("@pact-foundation/pact")
const Pact = require("@pact-foundation/pact").Pact
const { getClients, getClient, postClient } = require("../../src/consumer")
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

 describe("Pact for Clients Service API", () => {
    beforeAll(() => mockProvider.setup());  // Start the Mock Server and wait for it to be available
    afterEach(() => mockProvider.verify()); // Verifies that all interactions specified
    afterAll(() => mockProvider.finalize()); // Records the interactions between the Mock Server into the pact file and shuts it down

    describe('retrieving clients', () => {

        EXPECTED_CLIENTS= [{
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

        test('clients exist', async () => {
            // Setup Pact interactions
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
                    body: EXPECTED_CLIENTS,
                }
            })

            // make request to the Pact mock server to get all clients
            const response = await getClients()
 
            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            expect(response.data).toEqual(EXPECTED_CLIENTS)
            expect(response.status).toEqual(200)
        })
    })

    describe('retrieving a client', () => {
        test('Client with ID equal to 1 exists', async () => {
            const EXPECTED_CLIENT = { firstName: "Lisa", lastName: "Simpson", age: 8, "id": 1 }

            await mockProvider.addInteraction({
                state: 'a client with ID 1 exists',
                uponReceiving: 'a request to get a client',
                withRequest: {
                    method: 'GET',
                    path: '/clients/1',
                    headers: {
                        Accept: "application/json, text/plain, */*",
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: EXPECTED_CLIENT
                },
            });

            // make request to the Pact mock server to get a client with ID=1
            const response = await getClient(1)

            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            expect(response.data).toEqual(EXPECTED_CLIENT)
            expect(response.status).toEqual(200)
        })

        test('Client does not exist', async () => {

            const EXPECTED_ERROR = { message: "Client not found!" }

            await mockProvider.addInteraction({
                state: 'a client with ID 9 does not exists',
                uponReceiving: 'a request to get a client',
                withRequest: {
                    method: 'GET',
                    path: '/clients/9',
                    headers: {
                        Accept: "application/json, text/plain, */*",
                    },
                },
                willRespondWith: {
                    status: 404,
                    body: EXPECTED_ERROR
                },
            });
            
            // make request to the Pact mock server to get a client with ID=9
            const response = await getClient(9)
            // console.log(response)
            //expect(resp.status).toEqual(404)
            // expect(response.data).toEqual(EXPECTED_ERROR)
            //await expect(response).rejects.toThrow('Client not found!');
        })
    })

    describe('creating a client', () => {

        test('returns correct body, header and status code', async () => {

            const POST_CLIENT_BODY = { "firstName": "Andy", "lastName": "Test", "age": 21 }

            const POST_EXPECTED_CLIENT_BODY = { "firstName": POST_CLIENT_BODY.firstName, "lastName": POST_CLIENT_BODY.lastName, "age": POST_CLIENT_BODY.age, id: 3 }

            await mockProvider.addInteraction({
                state: 'a create a new client',
                uponReceiving: 'a request to create a client with firstname and lastname and age',
                withRequest: {
                    method: 'POST',
                    path: '/clients',
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: POST_CLIENT_BODY
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: Matchers.like(POST_EXPECTED_CLIENT_BODY).contents
                },
            });
            
            // make request to the Pact mock server to get a client with ID=1
            const response = await postClient(POST_CLIENT_BODY)
            expect(response.data).toEqual(POST_EXPECTED_CLIENT_BODY)
            expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
            expect(response.status).toEqual(200)
        })
    })

 })

