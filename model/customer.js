const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let customer = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: false,

        }
    },
    { collection: "customer" }
);

module.exports = mongoose.model("customer", customer);
