describe('Login', () => {

    it('deve fazer login com sucesso', () => {

        cy.intercept(
            'POST',
            '**/auth/login',
            {
                statusCode: 200,
                body: {
                    token: 'fake-token',
                    tipo: 'usuario'
                }
            }
        ).as('login');

        cy.visit('/login');

        cy.get('[data-cy="email"]')
            .type('teste@email.com');

        cy.get('[data-cy="password"]')
            .type('123456');

        cy.get('[data-cy="submit-login"]')
            .click();

        cy.wait('@login');

        cy.url()
            .should('not.include', '/login');
    });

    it('deve falhar login inválido', () => {

        cy.intercept(
            'POST',
            '**/auth/login',
            {
                statusCode: 401,
                body: {
                    message: 'Credenciais inválidas.'
                }
            }
        ).as('loginFail');

        cy.visit('/login');

        cy.get('[data-cy="email"]')
            .type('erro@email.com');

        cy.get('[data-cy="password"]')
            .type('senhaerrada');

        cy.get('[data-cy="submit-login"]')
            .click();

        cy.wait('@loginFail');

        cy.get('[data-cy="error"]')
            .should('be.visible')
            .and(
                'contain',
                'Credenciais inválidas'
            );
    });
});