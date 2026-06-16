describe('Cadastro', () => {

    it('cadastra usuário com sucesso', () => {

        cy.intercept(
            'POST',
            '**/users',
            {
                statusCode: 200,
                body: {
                    message: 'Cadastro realizado'
                }
            }
        ).as('cadastro');

        cy.visit('/login');

        cy.contains('CADASTRO')
            .click();

        cy.get('[data-cy="nome"]')
            .type('Bruno Teste');

        cy.get('[data-cy="email"]')
            .type('bruno@email.com');

        cy.get('[data-cy="cpf"]')
            .type('12345678909');

        cy.get('[data-cy="password"]')
            .type('Senha@123');

        cy.get('[data-cy="confirm-password"]')
            .type('Senha@123');

        cy.get('[data-cy="submit-login"]')
            .click();

        cy.wait('@cadastro');

        cy.contains(
            'Cadastro realizado com sucesso'
        )
            .should('exist');

    });
});