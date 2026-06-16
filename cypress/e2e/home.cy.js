describe('Página Home', () => {

    beforeEach(() => {

        cy.visit('/');

    });

    it('deve carregar a página inicial', () => {

        cy.get('[data-cy="home-page"]')
            .should('exist');

    });

    it('deve possuir botão para acessar catálogo', () => {

        cy.get('[data-cy="ver-colecao"]')
            .should('be.visible')
            .and('contain', 'VER COLEÇÃO');
    });

    it('deve navegar para catálogo ao clicar no botão', () => {

        cy.get('[data-cy="ver-colecao"]')
            .click();

        cy.url()
            .should('include', '/catalogo');
    });

    it('deve exibir produtos na home', () => {
        cy.get('[data-cy="produto-card-home"]')
            .should('exist')
            .and('have.length.greaterThan', 0);
    });

    it('deve permitir clicar em um produto', () => {

        cy.get('[data-cy="produto-card-home"]')
            .first()
            .click();

        cy.url()
            .should('include', '/produto/');
    });

    it('deve possuir filtro todos', () => {
        cy.get('[data-cy="filtro-todos"]')
            .should('be.visible');

    });
});