import type { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

// Supabase initialization using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Get compliance status from Supabase
 */
export async function getComplianceStatus(req: Request, res: Response): Promise<Response> {
  try {
    // Example of fetching data from a compliance table (adjust query as needed)
    const { data, error } = await supabase
      .from('compliance')
      .select('*');

    if (error) {
      throw error;
    }

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    console.error("Error fetching compliance status:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve compliance status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
