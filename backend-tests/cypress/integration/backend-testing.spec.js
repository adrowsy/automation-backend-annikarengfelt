/// <reference types="cypress" />

import * as api from '../helpers/generalHelpers.js'
import * as data from '../../../hotel-test/server/data.js'

// Endpoints append baseUrl set in cypress.json
const ROOMS = '/rooms/'
const CLIENTS = '/clients/'
const BILLS = '/bills/'
const RESERVATIONS = '/reservations/'

describe('Backend-testing of Hotel Application', () => {
    it('[TC 01] View all rooms', () => {

        api.requestAllAndAssert(ROOMS, data.rooms)

    })

    it('[TC 02] View all clients', () => {

        api.requestAllAndAssert(CLIENTS, data.clients)

    })

    it('[TC 03] View all bills', () => {

        api.requestAllAndAssert(BILLS, data.bills)

    })

    it('[TC 04] View all reservations', () => {

        api.requestAllAndAssert(RESERVATIONS, data.reservations)

    })

    it('[TC 05] Add a feature to a room', () => {

        // Object to be updated
        let room = data.rooms[0]

        // New values
        let updatedRoom = {
            "id": 1,
            "created": "2020-01-03T12:00:00.000Z",
            "category": "double",
            "floor": 1,
            "number": 101,
            "available": true,
            "price": 1500,
            "features": [
                "balcony",
                "ensuite",
                "sea_view"
            ]
        }

        // Update the room
        api.requestUpdate(ROOMS, room.id, updatedRoom)

        // Reverse update to not interfere with other test cases
        api.requestUpdate(ROOMS, room.id, room)
        cy.log('Room changed back to original')


    })

    it('[TC 06] Create a room', () => {
        let newRoom = {
            "category": "single",
            "floor": 2,
            "number": 201,
            "available": true,
            "price": 1500,
            "features": [
                "balcony",
                "ensuite",
                "sea_view"
            ]
        }

        api.requestCreate('room', newRoom)

        api.requestDeleteLastObject('room')

        })

    it('[TC 07] Update a reservation', () => {

        // Object to be updated
        let reservation = data.reservations[0]

        // New values
        let newEndDate = reservation.end.slice(0, -2) + '05'

        let updatedReservation = {
            "id": reservation.id,
            "created": reservation.created,
            "start": reservation.start,
            "end": newEndDate,
            "client": reservation.client,
            "room": reservation.room,
            "bill": reservation.bill
        }

        // Update reservation
        api.requestUpdate(RESERVATIONS, reservation.id, updatedReservation)

        // Reverse update to not interfere with other test cases
        api.requestUpdate(RESERVATIONS, reservation.id, reservation)
        cy.log('Reservation changed back to original')

    })


    it('[TC 08] Delete a reservation', () => {

        // Create a reservation to be safely deleted
        cy.authenticateSession()
            .then(response => {
                api.request('POST', '/reservation/new')
            })

        api.requestDeleteLastObject('reservation')

    })

})