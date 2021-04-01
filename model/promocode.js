const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let promo = new Schema(
    {
        promocode: {
            type: String,
            required: true
        }
    },
    { collection: "promo" }
);

module.exports = mongoose.model("promo", promo);
