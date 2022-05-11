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
    const {
      model,
      xaiMethod,
      dataset,
      sequenceLength,
      startDate,
      endDate,
      mode,
      instance,
    } = req.body;
    console.log("Model Data: ", req.body);
    var filePath = path.join(__dirname, "../../../../../backend");
    const streamTIME = fs.createReadStream(filePath + `/data/time_df.csv`);
    const dataTIME: any = await streamToString(streamTIME);

    if (mode === "bar") {
      if (instance === "Global") {
        const stream = fs.createReadStream(
          filePath +
            `/data/shap_values_${xaiMethod}_${startDate}_${endDate}.csv`
        );
        const data: any = await streamToString(stream);

        let finalData: {
          id: string;
          value: number;
        }[] = [];
        data.forEach((row: any, index: Number) => {
          const dataRow = row;
          Object.keys(row).forEach((key) => {
            dataRow[key] = Math.abs(Number(dataRow[key]));
          });
          finalData.push({
            id: Object.values(dataTIME[data.length - 1 - index])[0],
            ...dataRow,
          });
        });

        res.status(200).json({ data: finalData });
      } else {
        const stream = fs.createReadStream(
          filePath + `/data/shap_values_${xaiMethod}_${instance}.csv`
        );
        const data: any = await streamToString(stream);
        const indexDate =
          dataTIME.findIndex((d) => d.Date === instance) + data.length - 1;
        console.log(instance);
        console.log(indexDate);

        let finalData: {
          id: string;
          value: number;
        }[] = [];
        data.forEach((row: any, index: Number) => {
          const dataRow = row;
          Object.keys(row).forEach((key) => {
            dataRow[key] = Math.abs(Number(dataRow[key]));
          });
          finalData.push({
            id: Object.values(dataTIME[indexDate - index])[0],
            ...dataRow,
          });
        });

        res.status(200).json({ data: finalData });
      }
    } else {
      const stream = fs.createReadStream(
        filePath +
          `/data/shap_values_is_${xaiMethod}_${startDate}_${endDate}.csv`
      );
      const data: any = await streamToString(stream);

      let finalData: {
        id: string;
        color: string;
        hidden: boolean;
        data: { x: any; y: any }[];
      }[] = [];

      data.forEach((row: any, index) => {
        if (finalData.length === 0) {
          const keys = Object.keys(row);
          const values = Object.values(row);

          keys.forEach((key) => {
            finalData.push({
              id: key,
              color: "hsl(137, 70%, 50%)",
              hidden: true,
              data: [
                {
                  x: Object.values(dataTIME[data.length - 1 - index])[0],
                  y: row[key],
                },
              ],
            });
          });
        } else {
          const keys = Object.keys(row);

          keys.forEach((key, indexKey) => {
            finalData[indexKey].data.push({
              x: Object.values(dataTIME[data.length - 1 - index])[0],
              y: row[key],
            });
          });
        }
      });

      res.status(200).json({ data: finalData });
    }
  }
}
