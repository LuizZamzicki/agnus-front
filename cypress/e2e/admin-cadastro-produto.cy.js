describe("Cadastro de Produto Admin", () => {

    beforeEach(() => {

        cy.loginAdmin();

        cy.visit(
            "/admin/produtos/cadastrar"
        );
    });

    it("deve abrir tela de cadastro", () => {

        cy.url()
            .should(
                "include",
                "/admin/produtos/cadastrar"
            );

        cy.get(
            '[data-cy="produto-nome"]',
            {
                timeout: 10000
            }
        )
            .should("exist");

    });

    it("deve cadastrar produto completo", () => {

        cy.get('[data-cy="produto-nome"]')
            .type("Vestido Aurora");

        cy.get('[data-cy="produto-descricao"]')
            .type(
                "Vestido elegante para teste automatizado"
            );

        cy.get('[data-cy="produto-custo"]')
            .type("50");

        cy.get('[data-cy="produto-preco-venda"]')
            .type("120");

        cy.get('[data-cy="abrir-modal-categoria"]')
            .click();

        cy.get('[data-cy="nova-categoria-nome"]')
            .type(
                "Categoria Cypress"
            );

        cy.get('[data-cy="salvar-categoria"]')
            .click();

        cy.get('[data-cy="produto-categoria"]')
            .find("option")
            .contains(
                "Categoria Cypress"
            )
            .then(option => {

                cy.get(
                    '[data-cy="produto-categoria"]'
                )
                    .select(
                        option.val()
                    );
            });

        cy.get('[data-cy="nova-grade-nome"]')
            .type("M");

        cy.get('[data-cy="adicionar-grade"]')
            .click();

        cy.get('[data-cy="grade-item"]')
            .should(
                "contain.text",
                "M"
            );

        cy.get('[data-cy="nova-cor-nome"]')
            .type("Azul");


        cy.get('[data-cy="adicionar-cor"]')
            .click();

        cy.get(
            '[data-cy^="upload-foto-cor-"]'
        )
            .selectFile(
                "cypress/fixtures/imagem-teste.png",
                {
                    force: true
                }
            );

        cy.get(
            '[data-cy="salvar-produto"]'
        )
            .click();

        cy.url()
            .should(
                "include",
                "/admin/produtos"
            );

    });
});