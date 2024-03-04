describe("Login page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("Should have main header", () => {
    cy.get("h1").first().should("have.text", "Hi. Where are you headed?");
  });

  it("Should have Google Login button", () => {
    cy.get(".icon-button").first().should("have.text", "Continue with Google");
    cy.get(".icon-button").first().find("svg");
  });
});
