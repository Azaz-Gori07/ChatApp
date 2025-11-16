import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env.js";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_SECRET,
});


export const presignUpload = async(req,res)=>{
  const { filename } = req.body;
  if(!filename) return res.status(400).json({ message: "filename required" });

  const fileId = Date.now()+"-"+filename;
  const fileUrl = `http://localhost:5001/uploads/${fileId}`;

  return res.json({
    uploadUrl: fileUrl,   // DEV MODE
    fileUrl: fileUrl
  });
}


export const uploadImage = async (req, res, next) => {
  try {
    const { image } = req.body; // base64 string
    
    const result = await cloudinary.uploader.upload(image, {
      folder: "chat-app",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }

  
};
