import type { Request, Response } from "express";
import multer from "multer";
import axios from "axios";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit the file size to 10MB
});

/**
 * Handles IPFS file upload by receiving files from the client
 * and interacting with an IPFS API.
 */
export async function uploadToIPFS(req: Request, res: Response): Promise<Response> {
  upload.single("file")(req, res, async (err: any) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({
        status: "error",
        message: "Failed to upload file",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file provided",
        });
      }

      // Sending file to IPFS using a hypothetical IPFS API endpoint
      const ipfsResponse = await axios.post("https://ipfs.infura.io:5001/api/v0/add", req.file.buffer, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.status(200).json({
        status: "success",
        data: ipfsResponse.data, // IPFS response with file details
      });
    } catch (error: any) {
      console.error("Error uploading file to IPFS:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to upload to IPFS",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
