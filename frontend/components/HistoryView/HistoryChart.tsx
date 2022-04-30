// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { memo, useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";
import { useStore } from "@utils/settingsStore";
import { useColor } from "@components/Chart/utils";

const HistoryChart = memo(() => {
  const [data, setData] = useState();
  const {
    model,
    xaiMethod,
    dataset,
    timestepSegment,
    inspectionViewData,
    inspectionView,
  } = useStore();

  const color = useColor();
  const colorAccessor = (d: any) => color(d.id);

  useEffect(() => {
    async function fetchData() {
      if (!timestepSegment) return;
      const res = await fetch("http://localhost:3000/api/HistoryData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          xaiMethod: xaiMethod.toLowerCase(),
          dataset,
          timestepSegment,
          instance: inspectionView,
          startDate: inspectionViewData[timestepSegment[0]],
          endDate: inspectionViewData[timestepSegment[1]],
          mode: "bar",
        }),
      });
      const { data } = await res.json();
      setData(data);
    }
    fetchData();
  }, [
    dataset,
    inspectionView,
    inspectionViewData,
    model,
    timestepSegment,
    xaiMethod,
  ]);
  console.log(data);

  if (!data || !timestepSegment) {
    return (
      <div className="flex items-center justify-center w-full h-full ">
        <span className="inline-block w-2 h-2 ml-2 bg-gray-500 rounded-full animate-flash"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.4s]"></span>
      </div>
    );
  }

  const keys = Object.keys(data[0]);
  keys.splice(0, 1);

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="id"
      margin={{ top: 10, right: 20, bottom: 60, left: 70 }}
      padding={0.1}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: false }}
      colors={colorAccessor}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 6,
        format: (value: any) => {
          if (inspectionView === "Global") {
            const index = data.findIndex((d) => d.id === value);
            return `-${Math.abs(index - data.length + 1)} t`;
          } else {
            return value;
          }
        },
        tickValues: 2,
        tickPadding: 0,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 2,
        tickRotation: 0,
        legend: "Shapley Value",
        legendPosition: "middle",
        legendOffset: -45,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      enableLabel={false}
      role="application"
      ariaLabel="Nivo bar chart demo"
    />
  );
});

HistoryChart.displayName = "HistoryChart";

export default HistoryChart;
