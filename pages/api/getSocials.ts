// This API route is deprecated - data is now static in pages/index.tsx
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    res.status(410).json({ error: 'This endpoint is deprecated. Data is now static.' })
  }