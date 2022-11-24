describe('Authenticate with username, password', () => {
  it('Should start from auth page', () => {
    cy.visit('/auth');
  });

  it('Should show the login form', () => {
    cy.visit('/auth');
    cy.get('form.form').should('exist');
  });

  it("Should be error if didn't type anything", () => {
    cy.visit('/auth');

    cy.get('form.form').get("button[type='submit'].q-btn").click();

    cy.get('form.form')
      .get('.q-field__messages')
      .should('have.length', 2)
      .contains('required');
  });

  it('Should login unsuccessfully', () => {
    cy.visit('/auth');

    cy.intercept('POST', '**/api/auth', {
      fixture: 'auth-failed',
      statusCode: 401
    }).as('Auth-Failed');
    cy.get('form.form')
      .get('input.q-field__native')
      .each((e) => {
        cy.wrap(e).focus().type('username');
      });
    cy.get('form.form')
      .get('button[type="submit"].q-btn')
      .click()
      .get('svg.q-spinner.q-spinner-mat')
      .should('be.visible');

    cy.wait('@Auth-Failed');

    cy.get('form.form').get('.form-message').should('be.visible');

    cy.url().should('contain', '/auth');
  });

  it('Should login successfully', () => {
    cy.visit('/auth');
    cy.intercept('POST', '**/api/auth', { fixture: 'auth' }).as('Auth-Success');
    cy.get('form.form')
      .get('input.q-field__native')
      .each((e) => {
        cy.wrap(e).focus().type('iamroot');
      });
    cy.get('form.form').get('button[type="submit"].q-btn').click();
    cy.wait('@Auth-Success');
    cy.url().should('include','/note')
  });
});
