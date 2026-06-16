describe("Cadastro de Produto", () => {

    beforeEach(() => {
        cy.visit("/admin/produtos/cadastrar");
    });


    it("deve cadastrar um produto completo", () => {

        cy.get('[data-cy="produto-nome"]')
            .type("Vestido Aurora");

        cy.get('[data-cy="produto-descricao"]')
            .type("Vestido elegante para teste");

        cy.get('[data-cy="produto-custo"]')
            .type("50");

        cy.get('[data-cy="produto-preco-venda"]')
            .type("120");

        cy.get('[data-cy="abrir-modal-categoria"]')
            .click();

        cy.get('[data-cy="nova-categoria-nome"]')
            .type("Vestidos");

        cy.get('[data-cy="salvar-categoria"]')
            .click();

        cy.get('input[placeholder="PP"]')
            .type("M");

        cy.get('[data-cy="adicionar-grade"]')
            .click();

        cy.get('[data-cy="nova-cor-nome"]')
            .type("Azul");

        cy.get('[data-cy="nova-cor-acrescimo"]')
            .type("10");

        cy.get('[data-cy="adicionar-cor"]')
            .click();

        cy.get('input[type="file"]')
            .selectFile(
                "cypress/fixtures/imagem-teste.png",
                { force: true }
            );

        cy.get('[data-cy="salvar-produto"]')
            .click();

        cy.url()
            .should("include", "/admin/produtos");

    });

    describe("Editar Produto", () => {

        it("deve editar produto existente", () => {

            const produtoFake = {

                nome: "Produto Teste Cypress",
                descricao: "Produto criado para edição",
                preco_custo: 50,
                preco_base: 100,
                ativo: true,
                grades: [
                    {
                        nome: "M",
                        acrescimo: 0
                    }
                ],

                cores: [
                    {
                        nome: "Azul",
                        tonalidade: "#0000ff",
                        acrescimo: 0,
                        fotos: [
                            "/uploads/teste.png"
                        ]
                    }
                ]
            };

            cy.request({
                method: "POST",
                url: `${Cypress.env("apiUrl")}/products`,
                body: produtoFake
            })
                .then((response) => {
                    const id = response.body.id;

                    cy.visit(`/admin/produtos/editar/${id}`);

                    cy.get('[data-cy="produto-nome"]')
                        .should("have.value", "Produto Teste Cypress")
                        .clear()
                        .type("Produto Editado Cypress");

                    cy.get('[data-cy="produto-descricao"]')
                        .clear()
                        .type("Descrição alterada pelo teste");

                    cy.get('[data-cy="salvar-produto"]')
                        .click();

                    cy.url()
                        .should("include", "/admin/produtos");

                });
        });
    });
});