const mongoose = require("mongoose");

const {Schema} = mongoose;

const categorySchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    budget: {
        type: Number,
        required: true,
    }
});

const BudgetCategory = mongoose.model("BudgetCategory", categorySchema);

module.exports = BudgetCategory;
