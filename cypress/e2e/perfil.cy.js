describe('Perfil cliente', () => {

    beforeEach(() => {

        localStorage.setItem(
            'auth_token',
            'fake-token'
        );

        localStorage.setItem(
            'auth',
            JSON.stringify({
                id_usuario: 1
            })
        );
    });

    it('deve carregar perfil', () => {

        cy.intercept(
            'GET',
            '**/users/1',
            {
                statusCode: 200,
                body: {
                    id_usuario: 1,
                    nome: 'Bruno',
                    email: 'teste@email.com',
                    cpf: '12345678900'
                }
            }
        ).as('perfil');

        cy.visit('/perfil');

        cy.wait('@perfil');

        cy.get('[data-cy="titulo-perfil"]')
            .should('exist');

        cy.get('[data-cy="nome-perfil"]')
            .should('have.value', 'Bruno');

        cy.get('[data-cy="email-perfil"]')
            .should('have.value', 'teste@email.com');

        cy.get('[data-cy="cpf-perfil"]')
            .should('have.value', '12345678900');
    });

    it('deve editar nome', () => {

        cy.intercept(
            'GET',
            '**/users/1',
            {
                statusCode: 200,
                body: {
                    id_usuario: 1,
                    nome: 'Bruno',
                    email: 'teste@email.com',
                    cpf: '123'
                }
            }
        ).as('perfil');

        cy.intercept(
            'PUT',
            '**/users/1',
            {
                statusCode: 200,
                body: {
                    message: 'ok'
                }
            }
        ).as('editar');

        cy.visit('/perfil');

        cy.wait('@perfil');

        cy.get('[data-cy="nome-perfil"]')
            .clear()
            .type('Bruno Novo');

        cy.get('[data-cy="salvar-perfil"]')
            .should('not.be.disabled')
            .click();

        cy.wait('@editar')
            .its('response.statusCode')
            .should('eq', 200);

        cy.get('[data-cy="success-message"]')
            .should('be.visible');
    });

    it('não deve salvar nome inválido', () => {

        cy.intercept(
            'GET',
            '**/users/1',
            {
                statusCode: 200,
                body: {
                    id_usuario: 1,
                    nome: 'Bruno',
                    email: 'teste@email.com',
                    cpf: '123'
                }
            }
        ).as('perfil');

        cy.visit('/perfil');

        cy.wait('@perfil');

        cy.get('[data-cy="nome-perfil"]')
            .clear()
            .type('A');

        cy.get('[data-cy="salvar-perfil"]')
            .should('not.be.disabled')
            .click();

        cy.get('[data-cy="error-message"]')
            .should('be.visible')
            .and('contain', '3 caracteres');
    });

});