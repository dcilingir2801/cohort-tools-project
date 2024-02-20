const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentsSchema = new Schema({
  firstName: String,
  LastName: String,
  email: String,
  phone: String,
  linkedinUrl: String,
  languages: [String],
  program: String,
  background: String,
  image: String,
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort",
  },
  projects: Array,
});

const Student = mongoose.model("Student", studentsSchema);

module.exports = Student;
