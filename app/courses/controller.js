import { CourseModel } from "../../models/course.js";
import Papa from "papaparse";

// Utility function to parse CSV
// const parseCsv = async (stringBuffer, req) => {
//   const inputRows = [];

//   return new Promise((resolve, reject) => {
//     Papa.parse(stringBuffer, {
//       header: false,
//       skipEmptyLines: true,
//       step: function (row) {
//         const nonEmptyValues = Object.values(row.data).some(
//           (value) => value !== undefined && value !== null && value !== ""
//         );
//         if (nonEmptyValues) {
//           inputRows.push(row.data);
//         }
//       },
//       complete: function () {
//         if (inputRows.length === 0) {
//           logUserActivity(req.user, ACTION_TYPES.ASSET_UPLOAD, req, {
//             actionSuccessful: false,
//             actionFailedReason: "File is empty.",
//           });

//           return reject({
//             message: "File doesn't contain any row.",
//             ok: false,
//           });
//         }

//         if (inputRows.length > 3000) {
//           logUserActivity(req.user, ACTION_TYPES.ASSET_UPLOAD, req, {
//             actionSuccessful: false,
//             actionFailedReason: "File contains more than 3000 rows.",
//           });

//           return reject({
//             message: "File contains more than 3000 rows.",
//             ok: false,
//           });
//         }

//         if (inputRows[0].length > 1000) {
//           logUserActivity(req.user, ACTION_TYPES.ASSET_UPLOAD, req, {
//             actionSuccessful: false,
//             actionFailedReason: "File contains more than 1000 columns.",
//           });

//           return reject({
//             message: "File contains more than 1000 columns.",
//             ok: false,
//           });
//         }

//         resolve({
//           parsedData: inputRows,
//           message: "File has been parsed successfully.",
//           ok: true,
//         });
//       },
//     });
//   });
// };

// Route to add a course
export const addCourse = async (req, res) => {
  const { name, description, duration, fileName, file } = req.body;

  if (!file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  try {
    // Parse the CSV content

    // Create the course entry in the database
    const course = await CourseModel.create({
      title: name,
      description,
      duration,
      content: file,
      originalFileName: fileName,
      createdBy: req.user._id,
    });
    
    res.status(201).json({
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
};

export const getCourses = async (req, res) => {
  console.log("I am called");
  try {
    const courses = await CourseModel.find().populate(
      "createdBy",
      "name email"
    ).populate("enrolledStudents", "name email");

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
};

export const getUserCourses = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await CourseModel.find({
      createdBy: id,
    }).populate("createdBy", "name email");

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
};

export const getUserEnrolledCourses = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await CourseModel.find({
      enrolledStudents: id,
    }).populate("createdBy", "name email");

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
};

export const enrollCourse = async (req, res) => {
  const { id } = req.params;
  console.log("I am called",id);
  try {
    const course = await CourseModel.findById(id).populate(
      "enrolledStudents",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already enrolled." });
    }
    console.log("I am called",course);
    course.enrolledStudents.push(req.user._id);
    await course.save();
    
    res.status(200).json({ message: "Enrolled successfully." , course});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
}

export const unenrollCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await CourseModel.findById(id).populate(
      "enrolledStudents",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: "You are not enrolled." });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (student) => student._id.toString() !== req.user._id.toString()
    );
    await course.save();

    res.status(200).json({ message: "Unenrolled successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error." });
  }
}