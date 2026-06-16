describe('Carrinho', () => {

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

    it('deve carregar carrinho', () => {
        cy.intercept(
            'GET',
            '**/carts?id_usuario=1',
            {
                body: [
                    {
                        id_carrinho: 1
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/cart-items/1',
            {
                body: [
                    {
                        id_carrinho_item: 10,
                        quantidade: 1,
                        preco_unitario: 100,
                        produto: {
                            nome: 'Camisa'
                        },
                        cor: {
                            nome: 'Preto'
                        },
                        grade: {
                            nome: 'M'
                        }
                    }
                ]
            }
        );

        cy.visit('/carrinho');

        cy.contains('Camisa')
            .should('exist');
    });

    it('deve alterar quantidade', () => {

        cy.intercept(
            'GET',
            '**/carts?id_usuario=1',
            {
                body: [{ id_carrinho: 1 }]
            }
        );

        cy.intercept(
            'GET',
            '**/cart-items/1',
            {
                body: [
                    {
                        id_carrinho_item: 10,
                        quantidade: 1,
                        preco_unitario: 100
                    }
                ]
            }
        );

        cy.intercept(
            'PUT',
            '**/cart-items/10',
            {
                statusCode: 200
            }
        ).as('update');

        cy.visit('/carrinho');

        cy.get('[data-cy="aumentar-10"]')
            .click();

        cy.wait('@update');
    });

    it('deve remover produto', () => {

        cy.intercept(
            'GET',
            '**/carts?id_usuario=1',
            {
                body: [{ id_carrinho: 1 }]
            }
        );

        cy.intercept(
            'GET',
            '**/cart-items/1',
            {
                body: [
                    {
                        id_carrinho_item: 10,
                        quantidade: 1
                    }
                ]
            }
        );

        cy.intercept(
            'DELETE',
            '**/cart-items/10',
            {
                statusCode: 200
            }
        ).as('delete');

        cy.visit('/carrinho');

        cy.get('[data-cy="remover-10"]')
            .click();

        cy.get('[data-cy="confirmar-remover"]')
            .click();

        cy.wait('@delete');
    });
});