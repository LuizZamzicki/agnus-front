describe('CRUD contatos', () => {

    beforeEach(() => {

        localStorage.setItem(
            'auth_token',
            'fake'
        );

        localStorage.setItem(
            'auth',
            JSON.stringify({
                id_usuario: 1
            })
        );

    });

    it('cadastrar contato', () => {

        cy.intercept(
            'GET',
            '**/user-contacts/1',
            {
                body: []
            }
        ).as('getContatos');

        cy.intercept(
            'POST',
            '**/user-contacts',
            {
                statusCode: 200,
                body: {
                    id_usuario_contato: 10
                }
            }
        ).as('saveContato');

        cy.visit('/contatos');

        cy.wait('@getContatos');

        cy.get('[data-cy="novo-contato"]')
            .click();

        cy.get('[data-cy="tipo-contato"]')
            .select('celular');

        cy.get('[data-cy="valor-contato"]')
            .type('44999999999');

        cy.get('[data-cy="salvar-contato"]')
            .click();

        cy.wait('@saveContato')
            .its('response.statusCode')
            .should('eq', 200);
    });

    it('editar contato', () => {

        cy.intercept(
            'GET',
            '**/user-contacts/1',
            {
                body: [
                    {
                        id_usuario_contato: 10,
                        tipo: 'celular',
                        valor: '44999999999',
                        principal: false
                    }
                ]
            }
        ).as('getContatos');

        cy.intercept(
            'PUT',
            '**/user-contacts/10',
            {
                statusCode: 200,
                body: {}
            }
        ).as('editarContato');

        cy.visit('/contatos');

        cy.wait('@getContatos');

        cy.get('[data-cy="editar-contato"]')
            .click();

        cy.get('[data-cy="valor-contato"]')
            .clear()
            .type('44988888888');

        cy.get('[data-cy="salvar-contato"]')
            .click();

        cy.wait('@editarContato')
            .its('response.statusCode')
            .should('eq', 200);
    });

    it('excluir contato', () => {

        cy.intercept(
            'GET',
            '**/user-contacts/1',
            {
                body: [
                    {
                        id_usuario_contato: 10,
                        tipo: 'celular',
                        valor: '44999999999',
                        principal: false
                    }
                ]
            }
        ).as('getContatos');

        cy.intercept(
            'DELETE',
            '**/user-contacts/10',
            {
                statusCode: 200
            }
        ).as('deleteContato');

        cy.visit('/contatos');

        cy.wait('@getContatos');

        cy.get('[data-cy="excluir-contato"]')
            .click();

        cy.get('[data-cy="confirmar-excluir-contato"]')
            .click();

        cy.wait('@deleteContato')
            .its('response.statusCode')
            .should('eq', 200);
    });
});