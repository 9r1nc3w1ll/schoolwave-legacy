describe('Create Employee Modal should be hidden', () => {
    it('passes', () => {
      cy.visit('http://localhost:3000/employee')
      cy.get('[data-cy="createEmployeeModal"]').should('not.be.visible')
    })
  })