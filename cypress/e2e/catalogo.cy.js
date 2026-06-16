describe('Catálogo de produtos', () => {

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

    it('deve carregar produtos no catálogo', () => {

        cy.intercept(
            'GET',
            '**/products/catalog?page=1&limit=12',
            {
                statusCode: 200,
                body: {
                    data: [
                        {
                            id_produto: 1,
                            nome: 'Camisa Teste',
                            preco_base: 99.90,
                            imagens: [
                                '/uploads/camisa.jpg'
                            ]
                        }
                    ],
                    pagination: {
                        totalPages: 1
                    }
                }
            }
        ).as('produtos');

        cy.intercept(
            'GET',
            '**/categories',
            {
                statusCode: 200,
                body: {
                    data: [
                        {
                            id_categoria: 1,
                            nome: 'Camisas'
                        }
                    ]
                }
            }
        ).as('categorias');

        cy.visit('/catalogo');

        cy.wait('@produtos');
        cy.wait('@categorias');

        cy.get('[data-cy="produto-card"]')
            .should('have.length', 1);

        cy.contains('Camisa Teste')
            .should('exist');
    });

    it('deve buscar produto pelo nome', () => {

        cy.intercept(
            'GET',
            '**/products/catalog?page=1&limit=12&search=camisa',
            {
                statusCode: 200,
                body: {
                    data: [
                        {
                            id_produto: 2,
                            nome: 'Camisa Preta',
                            preco_base: 120,
                            imagens: []
                        }
                    ],
                    pagination: {
                        totalPages: 1
                    }
                }
            }
        ).as('buscar');

        cy.visit('/catalogo');

        cy.get('[data-cy="buscar-produto"]')
            .type('camisa');

        cy.wait('@buscar');

        cy.contains('Camisa Preta')
            .should('exist');
    });

    it('deve ordenar produtos pelo menor preço', () => {

        cy.intercept(
            'GET',
            '**/products/catalog?page=1&limit=12',
            {
                body: {
                    data: [
                        {
                            id_produto: 1,
                            nome: 'Produto A',
                            preco_base: 200,
                            imagens: []
                        },
                        {
                            id_produto: 2,
                            nome: 'Produto B',
                            preco_base: 50,
                            imagens: []
                        }
                    ],
                    pagination: {
                        totalPages: 1
                    }
                }
            }
        );

        cy.visit('/catalogo');

        cy.get('[data-cy="ordenar"]')
            .select('menor');

        cy.get('[data-cy="produto-card"]')
            .first()
            .should('contain', 'Produto B');
    });

    it('deve abrir produto ao clicar no card', () => {

        cy.intercept(
            'GET',
            '**/products/catalog?page=1&limit=12',
            {
                body: {
                    data: [
                        {
                            id_produto: 10,
                            nome: 'Tênis Teste',
                            preco_base: 300,
                            imagens: []
                        }
                    ],
                    pagination: {
                        totalPages: 1
                    }
                }
            }
        );

        cy.visit('/catalogo');

        cy.get('[data-cy="produto-card"]')
            .click();

        cy.url()
            .should('include', '/produto/10');
    });
});