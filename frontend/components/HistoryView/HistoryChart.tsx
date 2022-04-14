// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { memo, useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";

const HistoryChart = memo(() => {
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/api/InspectionData");
      const { data: dataJson } = await res.json();

      setData(dataJson.map((d: any) => ({ ...d, id: d.id.split(" ")[0] })));
    }
    fetchData();
  }, []);

  if (!data) {
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
      margin={{ top: 10, right: 130, bottom: 50, left: 70 }}
      padding={0.1}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: false }}
      colors={{ scheme: "set3" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 6,
        tickValues: 2,
        tickPadding: 0,
        tickRotation: 0,
        legend: "Days",
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
