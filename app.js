const express = require('express');
const bodyParser = require('body-parser');
var { graphqlHTTP } = require('express-graphql'); // CommonJS
var mongoose = require('mongoose');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
const { buildSchema } = require('graphql');
const { importSchema } = require('graphql-import');

const PORT = 3000;
// Initialize a GraphQL schema
const graphQlSchema = buildSchema(importSchema('./graphql/schema/schema.graphql'));

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
)
  .then(() => {
    app.listen(PORT);
    console.log(`Connected to db. Running on port ${PORT}. Graphiql on localhost:3000/graphql`)
  })
  .catch(err => {
    console.log(err)
  });

