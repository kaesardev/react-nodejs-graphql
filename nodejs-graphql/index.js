const express = require("express");
const cors = require("cors");
const expressGraphql = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    repo: String!
    age: Int!
  }
  type Query {
    user(id: ID!): User
    users: [User]
    filteredUser(keyword: String!, filter: String!): [User]

  }
  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
    updateUser(id: ID!, name: String, repo: String, age: Int): User
    deleteUser(id: ID!): Boolean
  }
`);

const providers = {
  users: [],
};

let id = 0;

const resolvers = {
  user({ id }) {
    return providers.users.find((item) => item.id === Number(id));
  },
  users() {
    return providers.users;
  },
  filteredUser({ keyword, filter }) {
    return providers.users.filter((item) => {
      return item[filter].toString().includes(keyword);
    });
  },
  createUser({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age,
    };
    providers.users.push(user);
    return user;
  },
  updateUser({ id, name, repo, age }) {
    var index = providers.users.findIndex((user) => user.id == id);
    if (index > -1) {
      var prevUser = providers.users[index];
      var user = {
        ...prevUser,
        name: name || prevUser.name,
        repo: repo || prevUser.repo,
        age: age || prevUser.age,
      };
      providers.users[index] = user;
    }
    return user;
  },
  deleteUser({ id }) {
    var index = providers.users.findIndex((user) => user.id == id);
    if (index > -1) {
      providers.users.splice(index, 1);
      return true;
    }
    return false;
  },
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/graphql",
  expressGraphql({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

var port = 4000;
app.listen(port, () => {
  console.log(`Server is listening localhost:${port}`);
});
