const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const treeSchema = new Schema({
    name: {
        type: String
    },
    conifer: {
        type: Boolean
    },
    broadleaf: {
        type: Boolean
    },
    evergreen: {
        type: Boolean
    },
    deciduous: {
        type: Boolean
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Tree', treeSchema);
