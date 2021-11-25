/// <reference types="cypress" />

/**
 * Send a HTTP-request to application API
 * @param {*} method GET, POST, PUT or DELETE
 * @param {*} endpoint /resources or /resource/:id
 * @param {*} body optional
 */
function request(method, endpoint, body) {

    cy.request({
        method: method,
        url: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
        },
        body: body || ''
    })

}

/**
 * View all object items and assert data persistence.
 * @param {*} endpoint what objects to view
 * @param {*} assertionData 
 */

function requestAllAndAssert(endpoint, assertionData) {
    cy.authenticateSession()
        .then(response => {
            request('GET', endpoint)
        }).then((response => {
            // Assert data persistence
            // Expect same number of objects as in assertionData
            expect(response.body).to.have.length(assertionData.length)

            // Expect objects to match original data
            const RESPONSE_BODY_AS_STRING = JSON.stringify(response.body)
            expect(RESPONSE_BODY_AS_STRING).to.have.string(JSON.stringify(assertionData))

        }))
}

/**
 * Create a new instance of objectType.
 * @param {*} objectType ex. 'rooms', 'clients' etc.
 * @param {*} newObject 
 */
function requestCreate(objectType, newObject) {
    let creationEndpoint = '/' + objectType + '/new'
    let endpoint = '/' + objectType + 's/'

    cy.authenticateSession()
        .then(response => {
            request('POST', creationEndpoint, newObject)
        }).then(response => {
            // View all rooms to assert updated values
            request('GET', endpoint)
        }).then(response => {

            // Stringify newObject and remove first '{' and last '}'
            let sliceOfNewRoom = JSON.stringify(newObject).slice(1, -1)

            // Expect newObject to be found within endpoint
            const RESPONSE_BODY_AS_STRING = JSON.stringify(response.body)
            expect(RESPONSE_BODY_AS_STRING).to.have.string(sliceOfNewRoom)
            cy.log('Found new object within objects')

        })
}


/**
 * Delete the last object of one type.
 * @param {*} objectType ex. room, reservation
 */
function requestDeleteLastObject(objectType) {

    let endpoint = objectType + 's/'
    let id_endpoint = objectType + '/'

    cy.authenticateSession()
        .then(response => {
            request('GET', endpoint)
        }).then((response => {
            // Delete last instance of object
            let lastId = response.body[response.body.length -1].id
            request('DELETE', `${id_endpoint}${lastId}`)
        }))

}

/**
 * Updates values of one object
 * @param {*} endpoint type of object
 * @param {*} id objectid
 * @param {*} updatedObject new object values
 */

function requestUpdate(endpoint, id, updatedObject) {

    let id_endpoint = endpoint.slice(0, -2) + '/' + id

    cy.authenticateSession()
        .then(response => {
            // Change object to updatedObject
            request('PUT', id_endpoint, updatedObject)
        }).then(response => {
            // View all objects
            request('GET', endpoint)
        }).then(response => {
            // Expect object to be updated
            const RESPONSE_BODY_AS_STRING = JSON.stringify(response.body)
            expect(RESPONSE_BODY_AS_STRING).to.have.string(JSON.stringify(updatedObject))
        })
}

/**
 * Helper function to assert response codes other than 2xx.
 * May be used to assert that deleted objects are removed, .i.e. does no longer have landingpage. 
 * @param {*} method request-method
 * @param {*} endpoint request-endpoint
 * @param {*} statuscode assertion value
 */
function negativeRequestAssertion(method, endpoint, statuscode) {
    cy.request({
        method: method,
        url: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
        },
        failOnStatusCode: false
    }).its('status').should('eq', statuscode)

}

module.exports = {
    request,
    requestAllAndAssert,
    requestCreate,
    requestUpdate,
    requestDeleteLastObject
}