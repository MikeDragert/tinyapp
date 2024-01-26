const chai = require('chai');
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unathorized access to "http://localhost:8080/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent
      .post("/login")
      .send({ email: "user3@example.com", password: "dig" })
      .then((loginRes) => {
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          expect(accessRes).to.have.status(403);
        });
      });
  });
  it('GET "/" should redirect a user to /login if they are are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent
      .post("/logout")
      .then((loginRes) => {
        return agent.get("/").then((accessRes) => {
          expect(accessRes).to.redirectTo('http://localhost:8080/login');
          expect(accessRes).to.have.status(200);
          expect(accessRes.redirects).to.be.an('array').that.includes('http://localhost:8080/login');
        });
      });
      
  });
  it('GET "/urls/new" should redirect a user to /login if they are are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent
      .post("/logout")
      .then((loginRes) => {
        return agent.get("/urls/new").then((accessRes) => {
          expect(accessRes).to.redirectTo('http://localhost:8080/login');
          expect(accessRes).to.have.status(200);
          expect(accessRes.redirects).to.be.an('array').that.includes('http://localhost:8080/login');
        });
      });
      
  });
  it('GET "/urls/:id" should return an error message if they are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent
      .post("/logout")
      .then((loginRes) => {
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          expect(accessRes).to.have.status(403);
        });
      });
      
  });
  it('GET "/urls/:id" should return an error message if the URL does not exist', () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent
      .post("/login")
      .send({ email: "user3@example.com", password: "dig" })
      .then((loginRes) => {
        return agent.get("/urls/notExist").then((accessRes) => {
          expect(accessRes).to.have.status(404);
        });
      });
  });
});