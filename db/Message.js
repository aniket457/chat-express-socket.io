const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        message : String,
        userId : String
    }
)

module.exports = mongoose.model("messages", messageSchema);