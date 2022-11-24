describe('Create Note as Guest', () => {
  it('Go to HomePage', () => {
    cy.visit('/');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it('Should Create Form Visible & Create new Note', () => {
    cy.visit('/');

    cy.intercept('GET', '**/api/note*', { fixture: 'notes' });
    cy.intercept('POST', '**/api/note', { fixture: 'note' });

    cy.get('.note-create-container')
      .should('exist')
      .get('.q-editor__content')
      .should('exist')
      .type('this is the new note');

    cy.get('.note-create-container')
      .get('button[type="submit"].q-btn')
      .should('exist')
      .click();

    cy.get('.q-dialog__inner')
      .should('exist')
      .find('.q-card__actions')
      .should('exist')
      .find('button.q-btn')
      .should('exist')
      .click();

    cy.get('.q-notifications')
      .should('exist')
      .get(".q-notification.bg-positive[role='alert']")
      .should('exist')
      .get('.q-notification__message')
      .contains('Note created successfully.');
  });
});
