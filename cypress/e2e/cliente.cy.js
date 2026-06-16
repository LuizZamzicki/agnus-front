describe('Área do cliente', () => {

    beforeEach(() => {

        localStorage.setItem(
            'auth_token',
            'fake-token'
        );

        localStorage.setItem(
            'auth',
            JSON.stringify({
                user: {
                    id_usuario: 1,
                    nome: "Bruno",
                    email: "teste@email.com"
                }
            })
        );

    });

    it('deve carregar menu cliente', () => {
        cy.visit('/cliente');

        cy.get('[data-cy="menu-perfil"]')
            .should('exist');

        cy.get('[data-cy="menu-pedidos"]')
            .should('exist');

        cy.get('[data-cy="menu-enderecos"]')
            .should('exist');

        cy.get('[data-cy="menu-contatos"]')
            .should('exist');

        cy.get('[data-cy="menu-senha"]')
            .should('exist');
    });

    it('deve navegar para pedidos', () => {

        cy.visit('/cliente');

        cy.get('[data-cy="menu-pedidos"]')
            .click();

        cy.url()
            .should('include', '/cliente/pedidos');
    });

    it('deve navegar para endereços', () => {
        cy.visit('/cliente');

        cy.get('[data-cy="menu-enderecos"]')
            .click();

        cy.url()
            .should('include', '/cliente/enderecos');
    });

    it('deve fazer logout', () => {
        cy.visit('/cliente');

        cy.get('[data-cy="logout"]')
            .click();

        cy.url()
            .should('include', '/login');

        cy.window()
            .then(win => {

                expect(
                    win.localStorage.getItem('auth_token')
                ).to.be.null;
            });
    });

    it('não deve mostrar senha para usuário google', () => {
        localStorage.setItem(
            'auth',
            JSON.stringify({
                user: {
                    id_usuario: 1,
                    email: "teste@gmail.com",
                    google_id: "123"
                }
            })
        );

        cy.visit('/cliente');

        cy.get('[data-cy="menu-senha"]')
            .should('not.exist');
    });
});