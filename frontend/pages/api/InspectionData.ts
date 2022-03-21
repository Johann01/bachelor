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
    const data = await streamToString(stream);

    let finalData: {
      id: string;
      color: string;
      hidden: boolean;
      data: { x: any; y: any }[];
    }[] = [];
    data.forEach((row: any, index: Number) => {
      const dataRow = row;
      Object.keys(row).forEach((key) => {
        dataRow[key] = Number(dataRow[key]);
      });
      finalData.push({
        id: `-${index} Days`,
        ...dataRow,
      });
    });

    res.status(200).json({ data: finalData });
  }
}
