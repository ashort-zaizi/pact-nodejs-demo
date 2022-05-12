const Pact = require("@pact-foundation/pact").Pact
const { Matchers } = require("@pact-foundation/pact")
const { getUsers, getUser, postUser } = require("../../src/consumer")
const path = require("path")

// mock provider setup
const mockProvider = new Pact({
    port: 8081,   // start the mock provider on this port number
    log: path.resolve(process.cwd(), "__tests__/logs", "mock-provider.log"), // log file location and name
    dir: path.resolve(process.cwd(), "__tests__/pacts"), // location where pact contract will be saved
    spec: 2,  // Pact specification version
    logLevel: 'INFO',   // sets the log level to 'INFO' 
    pactfileWriteMode: "overwrite",  // property used to overwrite an existing pact contract file in the specified folder with the same filename
    consumer: "user-service-consumer",  // name given to the consumer 
    provider: "user-service-provider",  // name given to the provider
    consumerVersion: "1.0.0",   // consumer version number
    providerVersion: "1.0.0"    // provider version number
 })

describe("Pact for Users Service API", () => {
    beforeAll(() => mockProvider.setup());  // Start the Mock Server and wait for it to be available
    afterEach(() => mockProvider.verify()); // Verifies that all interactions specified
    afterAll(() => mockProvider.finalize()); // Records the interactions between the Mock Server into the pact contract file and shuts the mock provider down

    describe('given there are users', () => {
        describe('when a request is made to GET all users', () => {

            // Array of expected users
            // GET_USERS_EXPECTED_BODY = [
            //     { "firstName": "Andy", "lastName": "Short", "age": 45, "id": 1 }, 
            //     { "firstName": "Johnny", "lastName": "Depp", "age": 58, "id": 2 },
            //     { "firstName": "Amber", "lastName": "Heard", "age": 36, "id": 3 }]


            GET_USERS_EXPECTED_BODY = { 
                "firstName": Matchers.like("Andy"), 
                "lastName": Matchers.like("Short"), 
                "age": Matchers.like(45), 
                "id": Matchers.like(1) 
            }

            
            // Setup interactions
            beforeEach(() => {
                const interaction = {
                    state: "i have a list of users",
                    uponReceiving: "a request for all users",
                    withRequest: {
                      method: "GET",
                      path: "/users",
                      headers: {
                        Accept: "application/json, text/plain, */*",
                      },
                    },
                    willRespondWith: {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json; charset=utf-8",
                      },
                      // body: GET_USERS_EXPECTED_BODY,
                      body: Matchers.eachLike(GET_USERS_EXPECTED_BODY, { min: 2 }),
                    },
                }
                return mockProvider.addInteraction(interaction)  
            })

            it('will return a list of users', async() => {
                // make request to the Pact mock server to get all users
                const response = await getUsers()
                expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
                // expect(response.data).toEqual(GET_USERS_EXPECTED_BODY)
                expect(response.data.length).toEqual(2)
                expect(response.status).toEqual(200)
            })
        })
    })


    describe('given user with ID equal to 1 exists', () => {
        describe('when a request is made to get user with ID equal to 1', () => {

            // const EXPECTED_USER = { firstName: "Andy", lastName: "Short", age: 45, "id": 1 }

            const EXPECTED_USER = {
                firstName: Matchers.like("Andy"),
                lastName: Matchers.like("Short"),
                age: Matchers.like(8),
                "id": 1 
            }

            beforeEach(() => {
                const interaction = {
                    state: 'a user with ID equal to 1 exists',
                    uponReceiving: 'a request to get a single user',
                    withRequest: {
                        method: 'GET',
                        path: '/users/1',
                        headers: {
                            Accept: "application/json, text/plain, */*",
                        },
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: EXPECTED_USER
                    },
                }
                return mockProvider.addInteraction(interaction)  
            })

            it('will return user with ID equal to 1', async() => {

                // make request to the Pact mock server to get a user with ID=1
                const response = await getUser(1)
                expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
                // expect(response.data).toEqual(EXPECTED_USER)
                expect(response.data.firstName).toBeTruthy()
                expect(response.data.lastName).toBeTruthy()
                expect(response.data.age).toBeTruthy()
                expect(response.data.id).toBeTruthy()
                expect(response.status).toEqual(200)
            })
        })
    })


    describe('given a request body containing details of a new user is configured', () => {
        describe('when a request is sent to create the new user', () => {

            const NEW_USER_BODY = { "firstName": "Andy", "lastName": "Test", "age": 21 }
            const EXPECTED_USER_BODY = { "firstName": NEW_USER_BODY.firstName, "lastName": NEW_USER_BODY.lastName, "age": NEW_USER_BODY.age, id: 3 }

            beforeEach(() => {
                const interaction = {
                    state: 'user server is available',
                    uponReceiving: 'a request to create a new user with firstname, lastname and age',
                    withRequest: {
                        method: 'POST',
                        path: '/users',
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                        body: NEW_USER_BODY
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: Matchers.like(EXPECTED_USER_BODY).contents
                    },
                }
                return mockProvider.addInteraction(interaction)  
            })

            it('returns newly created user', async() => {
                
                // make request to the Pact mock server to create a new users
                const response = await postUser(NEW_USER_BODY)
                expect(response.data).toEqual(EXPECTED_USER_BODY)
                expect(response.headers['content-type']).toBe("application/json; charset=utf-8")
                expect(response.status).toEqual(200)
            })
        })
    })
 })

