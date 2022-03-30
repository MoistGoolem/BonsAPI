const treesResolver = require('./trees');
const authResolver = require('./auth');

const rootResolver = {
    ...authResolver,
    ...treesResolver
};

module.exports = rootResolver;
