var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DrawingSchema = new Schema({
    user_id:  String,
    longitude: Number,
    latitude:   Number,
    points: [{ x: Number, y: Number, z: Number }],
    meta: {
        upvotes: Number,
        downvotes:  Number
    }
},  {
    timestamps: true
});

module.exports = mongoose.model('Drawing', DrawingSchema);