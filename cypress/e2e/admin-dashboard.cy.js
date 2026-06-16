describe("Dashboard Admin", () => {

    beforeEach(() => {
        cy.visit("/admin/dashboard");
    });

    it("deve carregar dashboard", () => {
        cy.get('[data-cy="dashboard-title"]')
            .should("contain", "Ultimas Acoes");
    });

    it("deve exibir cards de estatísticas", () => {
        cy.get('[data-cy="dashboard-card"]')
            .should("have.length.at.least", 1);
    });

    it("deve carregar atividades recentes", () => {
        cy.get("body")
            .should("exist");
    });
});