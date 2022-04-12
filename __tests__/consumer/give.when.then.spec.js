describe('Pact with Order API', () => {
    describe('given there are orders', () => {
      describe('when a call to the API is made', () => {
        before(() => {
          return provider.addInteraction({
            state: 'there are orders',
            uponReceiving: 'a request for orders',
            withRequest: {
              path: '/orders',
              method: 'GET',
            },
            willRespondWith: {
              body: eachLike({
                id: 1,
                items: eachLike({
                  name: 'burger',
                  quantity: 2,
                  value: 100,
                }),
              }),
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
            },
          })
        })
  
        it('will receive the list of current orders', () => {
          return expect(fetchOrders()).to.eventually.have.deep.members([
            new Order(orderProperties.id, [itemProperties]),
          ])
        })
      })
      
    })
  })