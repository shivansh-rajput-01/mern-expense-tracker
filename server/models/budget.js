const mongoose = require("mongoose");

const {Schema} = mongoose;

const budgetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true,
    },
    budgetMoney: {
        type: Number,
        required: true,
    },
    budgetCategory: [
        {
            type: Schema.Types.ObjectId,
            ref: "BudgetCategory"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
