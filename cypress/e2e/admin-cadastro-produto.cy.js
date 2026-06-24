describe("Cadastro de Produto Admin", () => {

    beforeEach(() => {

        cy.window().then((win) => {
            win.localStorage.clear();

            win.localStorage.setItem("token", "fake-admin-token");

            win.localStorage.setItem(
                "auth",
                JSON.stringify({
                    user: {
                        id_usuario: 1,
                        nome: "Admin Cypress",
                        tipo: "administrador"
                    }
                })
            );
        });

        cy.intercept("GET", "**/categories*", {
            statusCode: 200,
            body: {
                data: [
                    { id: 1, nome: "Vestidos" },
                    { id: 2, nome: "Calçados" }
                ],
                pagination: { total: 2 }
            }
        }).as("categories");

        cy.intercept("POST", "**/categories*", {
            statusCode: 200,
            body: { id: 999, nome: "Categoria Cypress" }
        }).as("createCategory");

        cy.intercept("POST", "**/products*", {
            statusCode: 201,
            body: {
                id: 10,
                message: "Produto criado com sucesso"
            }
        }).as("createProduct");

        cy.visit("/admin/produtos/cadastrar");

        cy.wait("@categories");
    });

    it("deve abrir tela de cadastro", () => {

        cy.get('[data-cy="produto-nome"]', { timeout: 10000 })
            .should("be.visible");

        cy.url()
            .should("include", "/admin/produtos/cadastrar");
    });

    it("não deve salvar produto sem nome", () => {

        cy.get('[data-cy="salvar-produto"]')
            .click();

        cy.contains(
            "Por favor, preencha o nome do produto"
        )
            .should("exist");

    });

    it("deve remover grade adicionada", () => {

        cy.get('[data-cy="nova-grade-nome"]')
            .type("G");

        cy.get('[data-cy="adicionar-grade"]')
            .click();


        cy.get('[data-cy="grade-item"]')
            .should("exist");


        cy.get('[data-cy="remover-grade"]')
            .click();


        cy.get('[data-cy="grade-item"]')
            .should("not.exist");

    });

    it("deve remover cor adicionada", () => {

        cy.get('[data-cy="nova-cor-nome"]')
            .type("Preto");


        cy.get('[data-cy="adicionar-cor"]')
            .click();


        cy.get('[data-cy="remover-cor"]')
            .should("exist")
            .click();


        cy.get('[data-cy="remover-cor"]')
            .should("not.exist");

    });

    it("deve cadastrar produto completo", () => {

        cy.get('[data-cy="produto-nome"]').type("Vestido Aurora");

        cy.get('[data-cy="produto-descricao"]')
            .type("Vestido elegante para teste automatizado");

        cy.get('[data-cy="produto-custo"]').type("50");

        cy.get('[data-cy="produto-preco-venda"]').type("120");

        cy.get('[data-cy="abrir-modal-categoria"]').click();

        cy.get('[data-cy="nova-categoria-nome"]')
            .type("Categoria Cypress");

        cy.get('[data-cy="salvar-categoria"]').click();

        cy.wait("@createCategory");

        cy.get('[data-cy="produto-categoria"]')
            .should("exist");

        cy.get('[data-cy="nova-grade-nome"]').type("M");

        cy.get('[data-cy="adicionar-grade"]').click();

        cy.get('[data-cy="grade-item"]')
            .should("contain.text", "M");

        cy.get('[data-cy="nova-cor-nome"]').type("Azul");

        cy.get('[data-cy="adicionar-cor"]').click();

        cy.get('[data-cy^="upload-foto-cor-"]')
            .first()
            .selectFile("cypress/fixtures/imagem-teste.png", {
                force: true
            });

        cy.get('[data-cy="salvar-produto"]').click();

        cy.wait("@createProduct")
            .then((interception) => {

                expect(interception.request.body.nome)
                    .eq("Vestido Aurora");


                expect(interception.request.body.grades)
                    .have.length(1);


                expect(interception.request.body.cores)
                    .have.length(1);

            });

        cy.url().should("include", "/admin/produtos");
    });

});