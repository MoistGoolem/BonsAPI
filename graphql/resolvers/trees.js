const Tree = require('../../database/models/treeSchema');
const User = require('../../database/models/userSchema');
const { transformTree } = require('./merge');


module.exports = {
  //GET TREES
  trees: async () => {
    try {
      const trees = await Tree.find()
      return trees
        .map(tree => {
          return transformTree(tree);
        });
    } catch (err) {
      console.log(err)
      throw err;
    }
  },

  //CREATE TREE
  createTree: async (args, req) => {
    //checks auth
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    const tree = new Tree({
      name: args.treeInput.name,
      creator: req.userId
    });

    let createdTree;

    try {
      const result = await tree.save()
      createdTree = transformTree(result);
      const creator = await User.findById(req.userId)

      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdTrees.push(tree);
      await creator.save();

      return createdTree;
    } catch (err) {
      console.log(err);
      throw err;
    };
  }
}
