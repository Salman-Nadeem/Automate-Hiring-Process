import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import DbConnection from "@/app/api/libs/Db";
import JobApplication from "@/model/job_application";
import nc from "next-connect";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Memory Storage
const upload = multer({ storage: multer.memoryStorage() });

// Changed function name from "handler" to "jobApplicationHandler"
const jobApplicationHandler = nc();
jobApplicationHandler.use(upload.single("cv"));

const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "job_applications", resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

jobApplicationHandler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase(); // Database connection

    const { name, email, phone, cnic, currentAddress, education, lastSalary, expectedSalary, joinDate, whyHireYou, position, experience, references, skills } = req.body;
    
    let cvUrl = "";
    if (req.file) {
      cvUrl = (await uploadToCloudinary(req.file.buffer)) as string;
    }

    const newApplication = new JobApplication({
      name,
      email,
      phone,
      cnic,
      currentAddress,
      education,
      lastSalary,
      expectedSalary,
      joinDate,
      whyHireYou,
      position,
      experience,
      references,
      skills: JSON.parse(skills),
      cvUrl,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", cvUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default jobApplicationHandler;
export const config = { api: { bodyParser: false } };
