require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("./models/Cohorts.model.js");
const Student = require("./models/Students.model.js");

console.log(process.env.MONGODB_ATLAS_URL);
mongoose
  .connect(process.env.MONGODB_ATLAS_URL)
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const students = require("./students.json");
const cohorts = require("./cohorts.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
Student.find()
  .populate("cohort")
  .then((resp) => console.log(resp));
// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.get("/api/cohorts", (req, res) => {
  res.json(cohorts);
});

// ROUTES - DAY 3

// STUDENT ROUTES
//Create new student
app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    LastName: req.body.LastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body. background,
    image: req.body.image,
    cohort: "",
    projects: req.body.projects,
  })
  .then((createdStudent) => {
    res.status(201).json(createdStudent);
  })
  .catch((error) => {
    res.status(500).json({message: "Error while creating new student"});
  });
});

// Get all students
app.get("/api/students", (req, res) => {
  Student.find()
  .populate("cohort")
  .then((allStudents) => {
    res.status(200).json(allStudents);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while getting all students"});
  });
});

//Get all students from specific cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
  Student.find({cohort: req.params.cohortId})
  .populate("cohort")
  .then((foundStudents) => {
    res.status(200).json(foundStudents);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while getting students from specific cohort"});
  });
});

//Get specific student (by id)
app.get("/api/students/:studentId", (req, res) => {
  Student.findById(req.params.id)
  .populate("cohort")
  .then((student) => {
    res.status(200).json(student);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while getting specific student"});
  });
});

//Update specific students (by id)
app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then((updatedStudent) => {
    res.status(200).json(updatedStudent);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while updating specific student"});
  });
});

//Delete specific student (by id)
app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(204).send();
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while deleting specific student"});
  });
});

//COHORT ROUTES
//Creates a new cohort
app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManger: req.body.programManger,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
  .then((createdCohort) => {
    res.status(201).json(createdCohort);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while creating new cohort"});
  });
});


//Retrieves all cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find()
  .then((allCohorts) => {
    res.status(200).json(allCohorts);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while getting all cohorts"});
  });
});

//Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findById(req.params.id)
  .then((cohort) => {
    res.status(200).json(cohort);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while getting specific cohort"});
  });
});

//Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then((updatedCohort) => {
    res.status(200).json(updatedCohort);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while updating specific cohort"});
  });
});

//Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(204).send();
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while deleting specific cohort"});
  });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
