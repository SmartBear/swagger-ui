describe("XSS: OAuth2 authorizationUrl sanitization", () => {
  it("should filter out a javascript URL", () => {
    cy.visit("/?url=/documents/xss/oauth2.yaml")
      .window()
      .then(win => {
        let args = null
        const stub = cy.stub(win, "open", (...callArgs) => {
          args = callArgs
        }).as("windowOpen")

        cy.get(".sui-btn--authorize")
          .click()
          .get(".auth-container .sui-btn--primary")
          .click()
          .wait(100)
          .then(() => {
            console.log(args)
            expect(args[0]).to.match(/^about:blank/) 
          })

      })
  })
})
