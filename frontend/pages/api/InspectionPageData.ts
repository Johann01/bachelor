import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import csv from "csv-parser";
import * as d3 from "d3";

function streamToString(stream: any) {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.pipe(csv()).on("data", (chunk: any) => {
      const data = {};
      chunks.push(chunk);
    });
    stream.on("error", (err: any) => reject(err));
    stream.on("end", () => resolve(chunks));
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    var filePath = path.join(
      __dirname,
      "../../../../components/Chart/data.csv"
    );
    const stream = fs.createReadStream(filePath);
    const data: any = await streamToString(stream);

    res.status(200).json({ data: data });
  }
}
