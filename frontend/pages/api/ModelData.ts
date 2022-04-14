import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import csv from "csv-parser";

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
      "../../../../../backend/data/shap_values.csv"
    );

    const stream = fs.createReadStream(filePath);
    const data: any = await streamToString(stream);

    let finalData: {
      id: string;
      value: number;
    }[] = [];
    data.forEach((row: any, index: Number) => {
      if (finalData.length === 0) {
        Object.keys(row).forEach((key) => {
          row[key] = Math.abs(Number(row[key]));
          finalData.push({
            id: key,
            value: row[key],
          });
        });
      } else {
        Object.keys(row).forEach((key, index) => {
          finalData[index].value =
            finalData[index].value + Math.abs(Number(row[key]));
        });
      }
    });

    res.status(200).json({ data: finalData, mae: 5000, rmse: 16000 });
  }
}
