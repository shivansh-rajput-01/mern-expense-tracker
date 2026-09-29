const mongoose = require("mongoose");

const {Schema} = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: new mongoose.Types.ObjectId('6aaac57907a5f8da28873525')
    }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;