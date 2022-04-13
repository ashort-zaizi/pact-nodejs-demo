const { Matchers, Publisher } = require("@pact-foundation/pact")
const Pact = require("@pact-foundation/pact").Pact
const { getClients, getClient, postClient } = require("../../src/consumer")
const path = require("path")

// mock provider setup
const mockProvider = new Pact({
    port: 8081,
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


    describe('given there are clients', () => {
        describe('when a request is made to GET all clients', () => {

            // GET_EXPECTED_BODY = [
            //     { "firstName": "Lisa", "lastName": "Simpson", "age": 8, "id": 1 }, 
            //     { "firstName": "Wonder", "lastName": "Woman", "age": 30, "id": 2 },
            //     { "firstName": "Homer", "lastName": "Simpson", "age": 39, "id": 3 }]

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

            beforeEach(() => {
                const interaction = {
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
                    },
                  }
                return mockProvider.addInteraction(interaction)  
            })

            it('will return a list of clients', async() => {

                // make request to the Pact mock server to get all clients
                const response = await getClients()
                expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
                expect(response.data).toEqual(GET_EXPECTED_BODY)
                expect(response.status).toEqual(200)
            })
        })
    })


    // describe('given client with ID equal to 1 exists', () => {
    //     describe('when a request is made to get client with ID equal to 1', () => {

    //         const EXPECTED_CLIENT = { firstName: "Lisa", lastName: "Simpson", age: 8, "id": 1 }

    //         beforeEach(() => {
    //             const interaction = {
    //                 state: 'a client with ID equal to 1 exists',
    //                 uponReceiving: 'a request to get a single client',
    //                 withRequest: {
    //                     method: 'GET',
    //                     path: '/clients/1',
    //                     headers: {
    //                         Accept: "application/json, text/plain, */*",
    //                     },
    //                 },
    //                 willRespondWith: {
    //                     status: 200,
    //                     headers: {
    //                         "Content-Type": "application/json; charset=utf-8",
    //                     },
    //                     body: EXPECTED_CLIENT
    //                 },
    //             }
    //             return mockProvider.addInteraction(interaction)  
    //         })

    //         it('will return client with ID equal to 1', async() => {

    //             // make request to the Pact mock server to get a client with ID=1
    //             const response = await getClient(1)
    //             expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
    //             expect(response.data).toEqual(EXPECTED_CLIENT)
    //             expect(response.status).toEqual(200)
    //         })
    //     })
    // })


    // // context
    // describe('given a request body containing details of the new client is configured', () => {
    //     describe('when a request is sent to create the new client', () => {

    //         const NEW_CLIENT_BODY = { "firstName": "Andy", "lastName": "Test", "age": 21 }
    //         const EXPECTED_CLIENT_BODY = { "firstName": NEW_CLIENT_BODY.firstName, "lastName": NEW_CLIENT_BODY.lastName, "age": NEW_CLIENT_BODY.age, id: 3 }

    //         beforeEach(() => {
    //             const interaction = {
    //                 state: 'client server is available',
    //                 uponReceiving: 'a request to create a new client with firstname, lastname and age',
    //                 withRequest: {
    //                     method: 'POST',
    //                     path: '/clients',
    //                     headers: {
    //                         "Content-Type": "application/json;charset=utf-8",
    //                     },
    //                     body: NEW_CLIENT_BODY
    //                 },
    //                 willRespondWith: {
    //                     status: 200,
    //                     headers: {
    //                         "Content-Type": "application/json; charset=utf-8",
    //                     },
    //                     body: Matchers.like(EXPECTED_CLIENT_BODY).contents
    //                 },
    //             }
    //             return mockProvider.addInteraction(interaction)  
    //         })

    //         it('returns newly created client', async() => {
                
    //             // make request to the Pact mock server to create a new client
    //             const response = await postClient(NEW_CLIENT_BODY)
    //             expect(response.data).toEqual(EXPECTED_CLIENT_BODY)
    //             expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
    //             expect(response.status).toEqual(200)
    //         })
    //     })
    // })
 })

