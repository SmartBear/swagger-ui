describe("OAuth2 Application flow", function() {
  beforeEach(() => {
    cy.server()
    cy.route({
      url: "**/oauth/*",
      method: "POST"
    }).as("tokenRequest")
  })

  it("should make an application flow Authorization header request", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".sui-btn.sui-btn--authorize")
      .click()

      .get("div.modal-ux-content > div:nth-child(2)").within(() => {
        cy.get("#client_id")
          .clear()
          .type("confidentialApplication")

          .get("#client_secret")
          .clear()
          .type("topSecret")

          .get("button.sui-btn--primary")
          .click()
      })

    cy.get("button.close-modal")
      .click()

      .get("#operations-default-get_application")
      .click()

      .get(".sui-btn.try-out__btn")
      .click()

      .get(".sui-btn.execute")
      .click()

    cy.get("@tokenRequest")
      .its("request")
      .its("body")
      .should("equal", "grant_type=client_credentials")

    cy.get("@tokenRequest")
      .its("request")
      .its("headers")
      .its("authorization")
      .should("equal", "Basic Y29uZmlkZW50aWFsQXBwbGljYXRpb246dG9wU2VjcmV0")

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
})