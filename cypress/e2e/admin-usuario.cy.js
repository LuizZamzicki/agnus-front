describe("Admin - Usuários", () => {

    beforeEach(() => {
        cy.visit("/admin/usuarios");
    });

    it("deve listar usuários", () => {

        cy.get('[data-cy="usuario-tabela"]')
            .should("exist");

        cy.get('[data-cy^="usuario-linha-"]')
            .should("have.length.greaterThan", 0);

    });

    it("deve buscar usuário", () => {

        cy.get('[data-cy="usuario-busca"]')
            .type("admin");

        cy.get('[data-cy^="usuario-linha-"]')
            .should("exist");

    });

    it("deve filtrar por tipo", () => {

        cy.get('[data-cy="usuario-filtro-tipo"]')
            .select("admin");
        s
        cy.get('[data-cy="usuario-tabela"]')
            .should("exist");

    });

    it("deve alterar quantidade por página", () => {

        cy.get('[data-cy="usuario-limit"]')
            .select("20");

        cy.get('[data-cy="usuario-tabela"]')
            .should("exist");

    });

    it("deve navegar paginação", () => {

        cy.get('[data-cy="usuario-proxima"]')
            .then(($btn) => {

                if (!$btn.is(":disabled")) {
                    cy.wrap($btn).click();
                }

            });

        cy.get('[data-cy="usuario-anterior"]')
            .then(($btn) => {

                if (!$btn.is(":disabled")) {
                    cy.wrap($btn).click();
                }
            });
    });
});