const Tree = require('../../database/models/treeSchema');
const User = require('../../database/models/userSchema');

const trees = async treeIds => {
    try {
        const trees = await Tree.find({ _id: { $in: treeIds } });
        return trees.map(tree => {
            return transformTree(tree);
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const singleTree = async treeId => {
    try {
        const tree = await Tree.findById(treeId);
        return transformTree(tree);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdTrees: trees.bind(this, user._doc.createdTrees)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const transformTree = tree => {
    return {
        ...tree._doc,
        _id: tree.id,
        creator: user.bind(this, tree.creator)
    };
};

exports.transformTree = transformTree;
