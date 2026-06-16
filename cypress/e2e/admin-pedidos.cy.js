describe("Admin Pedidos", () => {

    beforeEach(() => {
        cy.visit("/admin/pedidos");
    });

    it("deve listar pedidos", () => {

        cy.get('[data-cy="tabela-pedidos"]')
            .should("exist");

        cy.get('[data-cy="pedido-row"]')
            .should("have.length.greaterThan", 0);

    });

    it("deve buscar pedido", () => {

        cy.get('[data-cy="buscar-pedido"]')
            .type("1");

        cy.get('[data-cy="pedido-row"]')
            .should("exist");

    });

    it("deve alterar status do pedido", () => {

        cy.get('[data-cy="editar-pedido"]')
            .first()
            .click();

        cy.get('[data-cy="novo-status-pedido"]')
            .select("pago");

        cy.get('[data-cy="salvar-status-pedido"]')
            .click();

    });
});