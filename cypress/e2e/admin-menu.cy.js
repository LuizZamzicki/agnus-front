describe("Menu Admin", () => {

    beforeEach(() => {
        cy.visit("/admin/produtos");
    });

    it("deve abrir dashboard pelo menu", () => {

        cy.get('[data-cy="menu-dashboard"]')
            .click();

        cy.url()
            .should("include", "/admin/dashboard");

    });

    it("deve abrir categorias", () => {

        cy.get('[data-cy="menu-produtos"]')
            .click();

        cy.get('[data-cy="submenu-categorias"]')
            .click();

        cy.url()
            .should("include", "/admin/categorias");

    });

    it("deve abrir pedidos", () => {
        cy.get('[data-cy="menu-pedidos"]')
            .click();

        cy.url()
            .should("include", "/admin/pedidos");
    });
});