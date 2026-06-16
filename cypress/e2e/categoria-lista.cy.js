describe("Categorias Admin", () => {

    beforeEach(() => {

        cy.visit("/admin/categorias");

    });

    it("deve abrir tela de categorias", () => {

        cy.get('[data-cy="tabela-categorias"]')
            .should("exist");

    });

    it("deve abrir modal de cadastro", () => {

        cy.get('[data-cy="btn-nova-categoria"]')
            .click();

        cy.contains("Nova Categoria")
            .should("exist");

    });

    it("deve cadastrar uma categoria", () => {
        cy.get('[data-cy="btn-nova-categoria"]')
            .click();

        cy.get('[data-cy="input-nome-categoria"]')
            .type("Camisetas");

        cy.get('[data-cy="btn-salvar-categoria"]')
            .click();

        cy.contains("Categoria cadastrada com sucesso!")
            .should("exist");

    });

    it("deve filtrar categoria", () => {
        cy.get('[data-cy="buscar-categoria"]')
            .type("Camisetas");

        cy.get('[data-cy="categoria-item"]')
            .should("contain.text", "Camisetas");
    });
});