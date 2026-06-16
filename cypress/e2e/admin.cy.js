describe("Painel Admin", () => {

    beforeEach(() => {
        cy.visit("/admin/produtos");
    });

    it("deve abrir painel administrativo", () => {
        cy.get('[data-cy="admin-page"]')
            .should("exist");

        cy.get('[data-cy="admin-title"]')
            .should("contain.text", "Produtos");
    });

    it("deve acessar cadastro de produto", () => {
        cy.visit("/admin/produtos/cadastrar");

        cy.get('[data-cy="admin-title"]')
            .should("contain.text", "Produtos");
    });
});