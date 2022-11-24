describe('Authenticate with Google Auth0', () => {
  it('Should click on Auth0 with Google', () => {
    cy.visit('/auth');

    cy.get("form.form>button[type='button'].q-btn").click();

    cy.origin('https://accounts.google.com', () => {
      cy.get('#identifierId').type('quanjoker09');
      cy.get('#identifierNext button').click();
      // cy.wait(5000);
      // cy.get('input[type="password"]').type('199809Ad1234');
      // cy.get('#passwordNext button').click();
    });
  });
});
