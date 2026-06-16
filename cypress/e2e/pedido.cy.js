describe('Pedidos cliente', () => {

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

    it('deve listar pedidos', () => {

        cy.intercept(
            'GET',
            '**/orders',
            {
                body: [
                    {
                        id_pedido: 10,
                        id_usuario: 1,
                        status: 'Pago',
                        valor_total: 150,
                        data_criacao: '2026-06-11'
                    }
                ]
            }
        ).as('pedidos');

        cy.intercept(
            'GET',
            '**/order-items/10',
            {
                body: [
                    {
                        id_pedido_item: 1,
                        quantidade: 1,
                        subtotal: 150,
                        produto: {
                            nome: 'Camiseta Fé'
                        }
                    }
                ]
            }
        ).as('itens');

        cy.visit('/pedidos');

        cy.wait('@pedidos');

        cy.get('[data-cy="pedido-card"]')
            .should('exist');

        cy.contains('Pedido #10')
            .should('exist');
    });

    it('deve abrir detalhes do pedido', () => {

        cy.intercept(
            'GET',
            '**/orders',
            {
                body: [
                    {
                        id_pedido: 10,
                        id_usuario: 1,
                        status: 'Pago',
                        valor_total: 150
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/order-items/10',
            {
                body: [
                    {
                        produto: {
                            nome: 'Camiseta Fé'
                        },
                        quantidade: 1,
                        subtotal: 150
                    }
                ]
            }
        );

        cy.visit('/pedidos');

        cy.get('[data-cy="abrir-pedido"]')
            .click();

        cy.get('[data-cy="pedido-itens"]')
            .should('be.visible');

        cy.get('[data-cy="item-produto"]')
            .should(
                'contain',
                'Camiseta Fé'
            );
    });
});