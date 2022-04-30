// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { memo, useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import { ResponsiveLine, SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";
import { useStore } from "@utils/settingsStore";
import { useColor } from "@components/Chart/utils";

const HistoryChartLine = memo(() => {
  const [data, setData] = useState();
  const { model, xaiMethod, dataset, timestepSegment, inspectionViewData } =
    useStore();

  const color = useColor();
  const colorAccessor = (d: any) => color(d.id);
  // const timestepSegment = [1362, 1377];
  console.log(data);
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
          startDate: inspectionViewData[timestepSegment[0]],
          endDate: inspectionViewData[timestepSegment[1]],
          mode: "line",
        }),
      });
      const { data } = await res.json();
      setData(data);
    }
    fetchData();
  }, [dataset, inspectionViewData, model, timestepSegment, xaiMethod]);

  if (!data || !timestepSegment) {
    return (
      <div className="flex items-center justify-center w-full h-full ">
        <span className="inline-block w-2 h-2 ml-2 bg-gray-500 rounded-full animate-flash"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.4s]"></span>
      </div>
    );
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 20, bottom: 60, left: 60 }}
      xScale={{ type: "time", format: "%Y-%m-%d" }}
      yScale={{
        type: "linear",
        stacked: false,
        min: "auto",
        max: "auto",
      }}
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
        tickRotation: 0,
        format: "%Y-%m-%d",
        tickValues: data[0].data.length - 1,
        legendOffset: 0,
        legendPosition: "middle",
      }}
      debugMesh={true}
      colors={colorAccessor}
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
