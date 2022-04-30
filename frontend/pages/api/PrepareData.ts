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
    const { model, xaiMethod, dataset, sequenceLength } = req.body;
    console.log("Prepare Data:", req.body);

    var filePath = path.join(__dirname, "../../../../../backend");
    const python = await spawnSync(
      "python",
      [
        "interpret.py",
        `--start`,
        sequenceLength[0],
        `--end`,
        sequenceLength[1],
        `--algorithm`,
        xaiMethod.toLowerCase(),
      ],
      {
        cwd: filePath + "/scripts/",
      }
    );

    console.log(python.stdout.toString());
    console.log(python.stderr.toString());

    return new Promise((resolve, reject) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "max-age=180000");
      res.end(JSON.stringify("Success"));
    });
  }
}
