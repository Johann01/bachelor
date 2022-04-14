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
    const fileName = req.body.fileName;
    var filePath = path.join(
      __dirname,
      "../../../../../backend/data/clean_data.csv"
    );

    const stream = fs.createReadStream(filePath);
    const data: any = await streamToString(stream);

    let finalData: {
      id: string;
      color: string;
      hidden: boolean;
      data: { x: any; y: any }[];
    }[] = [];
    data.forEach((row: any) => {
      if (finalData.length === 0) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const date = keys.shift();
        keys.forEach((key) => {
          finalData.push({
            id: key,
            color: "hsl(137, 70%, 50%)",
            hidden: true,
            data: [
              {
                x: row[date!],
                y: row[key],
              },
            ],
          });
        });
      } else {
        const keys = Object.keys(row);
        const date = keys.shift();
        keys.forEach((key, index) => {
          finalData[index].data.push({
            x: row[date!],
            y: row[key],
          });
        });
      }
    });

    res.status(200).json({ data: finalData });
  }
}
