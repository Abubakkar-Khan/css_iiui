import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET,
});

export function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export async function putObject({ key, body, contentType }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: key,
        folder: "css_iiui",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result); // result.secure_url will contain the direct public image link
        }
      }
    );
    stream.end(body);
  });
}

export async function deleteObject(url) {
  try {
    if (!url) return null;
    
    // Extract public_id from URL: e.g. "https://res.cloudinary.com/cloudname/image/upload/v12345/css_iiui/abc123xyz.jpg"
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    // Get everything after "/upload/" and strip the version prefix (e.g. "v12345678/")
    const pathAndFilename = parts[1].replace(/^v\d+\//, ""); // "css_iiui/abc123xyz.jpg"
    
    // Remove the file extension
    const lastDotIndex = pathAndFilename.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? pathAndFilename.substring(0, lastDotIndex) : pathAndFilename;
    
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    return null;
  }
}
