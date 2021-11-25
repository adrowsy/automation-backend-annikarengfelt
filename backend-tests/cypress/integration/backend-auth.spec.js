/// <reference types="cypress" />

describe('testing auth', () => {

    /**
     * Demo test case from Demo 007.
     */
    it('request client data', () => {
        cy.authenticateSession()
         .then(response => {
             cy.request({
                 method: 'GET',
                 url: '/clients',
                 headers: {
                     'Content-Type': 'application/json',
                     'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
                    },
                    body: ''
                }).then((response =>{
                    cy.log(response.body) // [Object{5}, Object{5}]
                    cy.log(response.body[0]) // Object{5}
                    cy.log(response.body[0].id) // 1
                    cy.log(response.body[0].created) // 2020-01-05T12:00:00.000Z
                    cy.log(response.body[0].name) // Jonas Hellman
                    cy.log(response.body[0].email) // jonas.hellman@example.com
                    cy.log(response.body[0].telephone) // 070 000 0001
                }))
            })
    })
})