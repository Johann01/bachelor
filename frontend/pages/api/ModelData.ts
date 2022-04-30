import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import csv from "csv-parser";
import { spawn, spawnSync } from "child_process";

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
  if (req.method === "POST") {
    const { model, xaiMethod, dataset, sequenceLength, startDate, endDate } =
      req.body;
    console.log("Model Data: ", req.body);
    var filePath = path.join(__dirname, "../../../../../backend");
    const pythonStatistics = await spawnSync("python", ["inference.py"], {
      cwd: filePath + "/scripts/",
    });

    console.log(JSON.parse(pythonStatistics.stdout.toString()));
    const { MAE, RMSE } = JSON.parse(pythonStatistics.stdout.toString());

    const stream = fs.createReadStream(
      filePath + `/data/shap_values_${xaiMethod}_${startDate}_${endDate}.csv`
    );
    const data: any = await streamToString(stream);

    console.log(MAE, RMSE);

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

    res.status(200).json({ data: finalData, mae: MAE, rmse: RMSE });
  }
}
