describe('Página contato', () => {

    it('deve enviar mensagem de contato', () => {
        cy.visit('/contato');

        cy.get('[data-cy="nome-contato"]')
            .type('Bruno Medeiros');

        cy.get('[data-cy="email-contato"]')
            .type('bruno@email.com');

        cy.get('[data-cy="mensagem-contato"]')
            .type('Gostaria de saber mais sobre os produtos.');

        cy.get('[data-cy="enviar-contato"]')
            .click();

        cy.get('[data-cy="mensagem-sucesso"]')
            .should(
                'contain',
                'Mensagem enviada com sucesso!'
            );
    });

    it('deve limpar campos após envio', () => {
        cy.visit('/contato');

        cy.get('[data-cy="nome-contato"]')
            .type('Bruno');

        cy.get('[data-cy="email-contato"]')
            .type('teste@email.com');

        cy.get('[data-cy="mensagem-contato"]')
            .type('Teste');

        cy.get('[data-cy="enviar-contato"]')
            .click();

        cy.get('[data-cy="nome-contato"]')
            .should('have.value', '');

        cy.get('[data-cy="email-contato"]')
            .should('have.value', '');

        cy.get('[data-cy="mensagem-contato"]')
            .should('have.value', '');
    });
});