describe('Produto - avaliações', () => {

    beforeEach(() => {

        localStorage.setItem(
            'auth',
            JSON.stringify({
                id_usuario: 1,
                nome: 'Bruno'
            })
        );

        localStorage.setItem(
            'auth_token',
            'fake-token'
        );

    });

    it('deve carregar produto corretamente', () => {

        cy.intercept(
            'GET',
            '**/products/1',
            {
                statusCode: 200,
                body: {
                    id_produto: 1,
                    nome: 'Camisa Teste',
                    descricao: 'Produto teste',
                    preco_base: 100
                }
            }
        );

        cy.intercept(
            'GET',
            '**/product-photos/1',
            {
                body: []
            }
        );

        cy.intercept(
            'GET',
            '**/product-colors/1',
            {
                body: [
                    {
                        id_produto_cor: 1,
                        nome: 'Preto'
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/product-grades/1',
            {
                body: [
                    {
                        id_produto_grade: 1,
                        nome: 'M'
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/product-reviews/1',
            {
                body: []
            }
        );

        cy.visit('/produto/1');

        cy.contains('Camisa Teste')
            .should('exist');
    });

    it('deve permitir enviar avaliação', () => {
        cy.intercept(
            'GET',
            '**/products/1',
            {
                body: {
                    id_produto: 1,
                    nome: 'Camisa Teste',
                    preco_base: 100
                }
            }
        );

        cy.intercept(
            'GET',
            '**/product-colors/1',
            {
                body: [
                    {
                        id_produto_cor: 1,
                        nome: 'Preto'
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/product-grades/1',
            {
                body: [
                    {
                        id_produto_grade: 1,
                        nome: 'M'
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/orders**',
            {
                body: [
                    {
                        id_pedido: 10,
                        status: 'entregue'
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
                        id_produto_cor: 1,
                        id_produto_grade: 1
                    }
                ]
            }
        );

        cy.intercept(
            'GET',
            '**/product-reviews/1',
            {
                body: []
            }
        );

        cy.intercept(
            'POST',
            '**/product-reviews',
            {
                statusCode: 200,
                body: {
                    id_avaliacao_produto: 5
                }
            }
        ).as('enviarReview');

        cy.visit('/produto/1');

        cy.get('[data-cy="escrever-avaliacao"]')
            .click();

        cy.get('[data-cy="nota-avaliacao"]')
            .clear()
            .type('5');

        cy.get('[data-cy="comentario-avaliacao"]')
            .type('Produto excelente, gostei muito.');

        cy.get('[data-cy="enviar-avaliacao"]')
            .click();

        cy.wait('@enviarReview')
            .its('response.statusCode')
            .should('eq', 200);

        cy.get('[data-cy="produto-alerta"]')
            .should(
                'contain',
                'Avaliação enviada'
            );
    });

    it('não deve enviar avaliação sem comentário', () => {

        cy.intercept(
            'GET',
            '**/product-reviews/1',
            {
                body: []
            }
        );

        cy.visit('/produto/1');

        cy.get('[data-cy="escrever-avaliacao"]')
            .click();

        cy.get('[data-cy="nota-avaliacao"]')
            .type('5');

        cy.get('[data-cy="enviar-avaliacao"]')
            .click();

        cy.get('[data-cy="produto-alerta"]')
            .should(
                'contain',
                'Digite um comentário'
            );
    });

    it('deve adicionar produto no carrinho', () => {

        cy.intercept(
            'GET',
            '**/carts?id_usuario=1',
            {
                body: []
            }
        );

        cy.intercept(
            'POST',
            '**/carts',
            {
                statusCode: 200,
                body: {
                    id_carrinho: 1
                }
            }
        );

        cy.intercept(
            'POST',
            '**/cart-items',
            {
                statusCode: 200,
                body: {}
            }
        ).as('addCarrinho');

        cy.visit('/produto/1');

        cy.get('[data-cy="tamanho-1"]')
            .click();

        cy.get('[data-cy="cor-1"]')
            .click();

        cy.get('[data-cy="adicionar-carrinho"]')
            .click();

        cy.wait('@addCarrinho')
            .its('response.statusCode')
            .should('eq', 200);
    });
});