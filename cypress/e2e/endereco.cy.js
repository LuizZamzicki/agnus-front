describe('CRUD endereços', () => {

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

    it('cadastrar endereço', () => {
        cy.intercept(
            'GET',
            '**/user-addresses/1',
            {
                body: []
            }
        ).as('getEnderecos');

        cy.intercept(
            'POST',
            '**/user-addresses',
            {
                statusCode: 200,
                body: {
                    message: 'Endereço cadastrado'
                }
            }
        ).as('saveEndereco');

        cy.visit('/enderecos');

        cy.wait('@getEnderecos');

        cy.get('[data-cy="novo-endereco"]')
            .click();

        cy.get('[data-cy="cep"]')
            .type('87000000');

        cy.get('[data-cy="logradouro"]')
            .type('Rua Teste');

        cy.get('[data-cy="numero"]')
            .type('100');

        cy.get('[data-cy="bairro"]')
            .type('Centro');

        cy.get('[data-cy="cidade"]')
            .type('Maringá');

        cy.get('[data-cy="estado"]')
            .select('PR');

        cy.get('[data-cy="salvar-endereco"]')
            .click();

        cy.wait('@saveEndereco')
            .should(({ response }) => {
                expect(response.statusCode).eq(200)
            });
    });

    it('excluir endereço', () => {

        cy.intercept(
            'GET',
            '**/user-addresses/1',
            {
                body: [
                    {
                        id_usuario_endereco: 5,
                        logradouro: 'Rua A',
                        numero: '10',
                        bairro: 'Centro',
                        cidade: 'Maringá',
                        estado: 'PR'
                    }
                ]
            }
        ).as('getEnderecos');

        cy.intercept(
            'DELETE',
            '**/user-addresses/5',
            {
                statusCode: 200
            }
        ).as('deleteEndereco');

        cy.visit('/enderecos');

        cy.wait('@getEnderecos');

        cy.get('[data-cy="excluir-endereco"]')
            .click();

        cy.get('[data-cy="confirmar-excluir-endereco"]')
            .click();

        cy.wait('@deleteEndereco')
            .its('response.statusCode')
            .should('eq', 200);
    });
});