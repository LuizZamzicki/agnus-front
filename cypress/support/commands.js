/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("loginAdmin", () => {

    const usuario = {

        nome: "Admin Cypress",
        email: "admin.cypress@teste.com",
        cpf: "12345678909",
        senha: "12345678!A"
    };

    cy.request({

        method: "POST",
        url: "http://localhost:3001/users",
        body: usuario,
        failOnStatusCode: false

    })
        .then(() => {

            cy.request({

                method: "POST",
                url: "http://localhost:3001/auth/login",

                body: {
                    email: usuario.email,
                    senha: usuario.senha
                }
            })
        })
        .then((response) => {

            expect(response.status)
                .to.eq(200);

            const token =
                response.body.token ||
                response.body.access_token ||
                response.body.accessToken;

            window.localStorage.setItem(
                "auth_token",
                token
            );

            window.localStorage.setItem(
                "auth",
                JSON.stringify(response.body)
            );
        });
});