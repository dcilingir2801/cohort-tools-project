const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String, 
    password: String,
    name: String
});

const Cohort = mongoose.model("Cohort", cohortsSchema);

module.exports = Cohort;
