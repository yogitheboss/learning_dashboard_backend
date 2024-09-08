import { CourseModel } from "../../models/course.js";

// here course details will be given by user from req body in format of form data
export const addCourse = async (req, res) => {
  const { name, description, duration, csvFile } = req.body;

  try {
    const course = await CourseModel.create({
      name,
      description,
      duration,
      content:csvFile,
      originalFileName: name,
      createdBy: req.user._id,
    });
  } catch (error) {
    console.log(error);
  }
};
