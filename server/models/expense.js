const mongoose = require("mongoose");

const {Schema} = mongoose;

const expenseSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        default: new mongoose.Types.ObjectId('6aabdde899b272ad811638d1')
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    budget: [
        {
            type: Schema.Types.ObjectId,
            ref: "Budget"
        }
    ]
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;