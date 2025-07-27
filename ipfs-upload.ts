import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";

/**
 * Uploads a file to IPFS using the Infura API.
 */
export async function uploadFileToIPFS(req: Request, res: Response): Promise<Response> {
  try {
    const file = req.file; // Assuming file is being uploaded via a middleware (e.g., multer)

    if (!file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded.",
      });
    }

    // Create form data to send the file to IPFS
    const form = new FormData();
    form.append("file", file.buffer, file.originalname);

    // Infura IPFS endpoint
    const url = `https://ipfs.infura.io:5001/api/v0/add`;

    const headers = {
      ...form.getHeaders(),
      Authorization: `Basic ${Buffer.from(`${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`).toString('base64')}`,
    };

    // Upload to IPFS
    const response = await axios.post(url, form, { headers });

    // If IPFS responds with success
    if (response.data && response.data.Hash) {
      return res.status(200).json({
        status: "success",
        ipfsHash: response.data.Hash,
      });
    } else {
      throw new Error("Failed to upload file to IPFS.");
    }
  } catch (error: any) {
    console.error("Error uploading file to IPFS:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to upload file to IPFS.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
