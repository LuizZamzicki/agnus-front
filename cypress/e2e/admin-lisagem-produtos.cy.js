describe("Admin - Produtos", () => {

    beforeEach(() => {
        cy.visit("/admin/produtos");
    });

    it("deve listar produtos e aplicar filtros", () => {
        cy.get('[data-cy="produto-tabela"]').should("exist");

        cy.get('[data-cy="produto-busca"]').type("teste");

        cy.get('[data-cy="produto-filtro-categoria"]').select(1);

        cy.get('[data-cy="produto-limit"]').select("20");
    });

    it("deve abrir tela de novo produto", () => {
        cy.get('[data-cy="produto-novo"]').click();

        cy.url().should("include", "/admin/produtos/cadastrar");
    });

    it("deve editar um produto", () => {
        cy.get('[data-cy^="produto-editar-"]')
            .first()
            .click();

        cy.url().should("include", "/editar");
    });

    it("deve deletar um produto", () => {
        cy.get('[data-cy^="produto-deletar-"]')
            .first()
            .click();

        cy.contains("Excluir produto").should("exist");

        cy.contains("button", "Excluir").click();

        cy.contains("Produto deletado com sucesso").should("exist");
    });

    it("deve navegar na paginação", () => {
        cy.get('[data-cy="produto-proxima"]').then(($btn) => {
            if (!$btn.is(":disabled")) {
                cy.wrap($btn).click();
            }
        });

        cy.get('[data-cy="produto-anterior"]').then(($btn) => {
            if (!$btn.is(":disabled")) {
                cy.wrap($btn).click();
            }
        });
    });
});