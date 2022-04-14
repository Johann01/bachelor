import React from "react";
import { styled } from "@stitches/react";
import * as d3 from "d3";
import { useColor } from "./utils";

export const TooltipWithContent = ({ x, y, data }) => {
  var color = useColor();

  const tooltipValues = [
    { name: "humidity", value: data.humidity },
    { name: "weather", value: data.weather },
    { name: "carbonDioxide", value: data.carbonDioxide },
    { name: "rain", value: data.rain },
  ].sort((a, b) => b.value - a.value);

  const yScale = d3
    .scaleLinear()
    .domain([d3.max(tooltipValues, (d) => Math.abs(d.value)), 0])
    .range([50, 0]);

  return (
    <div
      className="absolute top-0 left-0 z-10 p-3 text-center transition duration-100 ease-in-out bg-white border border-gray-400 rounded-md shadow-md"
      style={{
        transform: `translate(calc(${x}px),calc(${y}px)`,
      }}
    >
      <div className="flex flex-col gap-1 ">
        <div className="flex flex-row items-center justify-between w-full text-sm">
          <svg
            width="11"
            height="2"
            viewBox="0 0 11 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-4 mr-2"
          >
            <line
              y1="1"
              x2="11"
              y2="1"
              stroke="black"
              stroke-width="2"
              stroke-dasharray="4 2"
            />
          </svg>
          <p className="whitespace-nowrap">ground truth</p>
          <div className="w-full h-[2px] mx-2 rounded-full bg-slate-200" />
          <p>{data.temperatureGroundTruth.toFixed(3)}</p>
        </div>
        <div className="flex flex-row items-center justify-between w-full text-sm">
          <svg
            width="11"
            height="2"
            viewBox="0 0 11 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-4 mr-2"
          >
            <line y1="1" x2="10" y2="1" stroke="black" stroke-width="2" />
          </svg>
          <p className="whitespace-nowrap">predicition</p>
          <div className="w-full h-[2px] mx-2 rounded-full bg-slate-200" />
          <p>{data.temperaturePredicted.toFixed(3)}</p>
        </div>
      </div>
      <div className="flex flex-col mt-4 ">
        <div className="grid grid-cols-2 divide-x-2 divide-slate-600">
          <div>
            {tooltipValues
              .filter((d) => d.value < 0)
              .map((tooltipValue) => (
                <div key={tooltipValue.name} className="flex flex-col ">
                  <div className="flex flex-row items-center justify-between w-full text-sm">
                    <p>{tooltipValue.name}</p>
                    <div className="w-full h-[2px] mx-2 rounded-full bg-slate-200" />
                    <p>{Number(tooltipValue.value).toFixed(3)}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between w-full text-sm">
                    <p>{Number(tooltipValue.value).toFixed(3)}</p>
                    <div
                      className="h-4 p-2 rounded-sm text-slate-700"
                      style={{
                        backgroundColor: color(tooltipValue.name),
                        width: yScale(Math.abs(tooltipValue.value)),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div></div>
        </div>
        <div>
          <div className="grid grid-cols-2 divide-x-2 divide-slate-600">
            <div></div>
            <div>
              {tooltipValues
                .filter((d) => d.value >= 0)
                .map((tooltipValue) => (
                  <div key={tooltipValue.name} className="flex flex-col w-full">
                    <div className="flex flex-row items-center justify-between w-full text-sm">
                      <p>{tooltipValue.name}</p>
                      <div className="w-full h-[2px] mx-2 rounded-full bg-slate-200" />
                      <p>{Number(tooltipValue.value).toFixed(3)}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full text-sm">
                      <p>{Number(tooltipValue.value).toFixed(3)}</p>
                      <div
                        className="h-4 rounded-sm text-slate-700"
                        style={{
                          backgroundColor: color(tooltipValue.name),
                          width: yScale(tooltipValue.value),
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipWithContent;
