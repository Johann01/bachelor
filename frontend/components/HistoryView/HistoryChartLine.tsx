// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { memo, useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import { ResponsiveLine, SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";

const HistoryChartLine = memo(() => {
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/api/InputData");
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
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 20, bottom: 20, left: 60 }}
      xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
      yScale={{
        type: "linear",
        stacked: false,
        min: "auto",
        max: "auto",
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      axisBottom={{
        tickValues: 3,
        tickPadding: 5,
        tickRotation: 0,
        format: "%Y-%m-%d",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      colors={{ scheme: "set3" }}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointLabelYOffset={-12}
      enableSlices="x"
      enableGridX={false}
      useMesh={true}
    />
  );
});

HistoryChartLine.displayName = "HistoryChart";

export default HistoryChartLine;
