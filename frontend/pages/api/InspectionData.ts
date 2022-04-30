import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import csv from "csv-parser";
import { spawnSync } from "child_process";

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

    var filePath = path.join(__dirname, "../../../../../backend");

    const stream = fs.createReadStream(
      filePath + `/data/shap_values_is_${xaiMethod}_${startDate}_${endDate}.csv`
    );

    const data: any = await streamToString(stream);

    const streamGT = fs.createReadStream(
      filePath + `/data/ground_truth_df.csv`
    );
    const dataGT: any = await streamToString(streamGT);

    const streamPRED = fs.createReadStream(
      filePath + `/data/predictions_df.csv`
    );
    const dataPRED: any = await streamToString(streamPRED);

    const streamTIME = fs.createReadStream(filePath + `/data/time_df.csv`);
    const dataTIME: any = await streamToString(streamTIME);

    let finalData: {
      id: string;
      color: string;
      hidden: boolean;
      data: { x: any; y: any }[];
    }[] = [];
    data.forEach((row: any, index: number) => {
      const dataRow = row;
      Object.keys(row).forEach((key) => {
        dataRow[key] = Number(dataRow[key]);
      });

      finalData.push({
        shapleyValue: { ...dataRow },
        groundTruth: Number(Object.values(dataGT[index])[0]),
        prediction: Number(Object.values(dataPRED[index])[0]),
        timestep: Object.values(dataTIME[data.length - 1 - index])[0],
      });
    });

    res.status(200).json({ data: finalData });
  }
}
