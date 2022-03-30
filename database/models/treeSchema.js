const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const treeSchema = new Schema({
    name: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Tree', treeSchema);