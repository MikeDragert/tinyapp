const { assert } = require('chai');
const { getUserByEmail, getUserById } = require('../handlers/helpers.js')


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined for an invalid email', () => {
    const user  = getUserByEmail("dud@dud.com", testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  })
  it ('should return undefined with an undefined email', () => {
    const user  = getUserByEmail(undefined, testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  })
});

describe('getUserById', function() {
  it('should return a user with valid id', function() {
    const user = getUserById("userRandomID", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined for an invalid id', () => {
    const user  = getUserById("duddud", testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  })
  it ('should return undefined with an undefined id', () => {
    const user  = getUserById(undefined, testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  })
});