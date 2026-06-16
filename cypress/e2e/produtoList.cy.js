describe('Página Produtos', () => {

    beforeEach(() => {

        cy.visit('/produtos');

    });

    it('deve carregar página de produtos', () => {
        cy.get('[data-cy="produtos-page"]')
            .should('exist');
    });

    it('deve permitir buscar produto', () => {
        cy.get('[data-cy="buscar-produto"]')
            .type('camisa');

        cy.get('[data-cy="produto-card"]')
            .should('exist');
    });

    it('deve filtrar por categoria', () => {
        cy.get('[data-cy="filtro-categoria"]')
            .select(1);

        cy.get('[data-cy="produto-card"]')
            .should('exist');
    });

    it('deve exibir produtos', () => {
        cy.get('[data-cy="produto-card"]')
            .should('have.length.greaterThan', 0);
    });

    it('deve abrir detalhe do produto', () => {

        cy.get('[data-cy="produto-card"]')
            .first()
            .click();

        cy.url()
            .should('include', '/produtos/');
    });
});