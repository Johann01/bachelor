// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyResponsiveBar = () => {
  const [data, setData] = useState();
  const theme = useTheme();
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/api/InspectionData");
      const { data: dataJson } = await res.json();

      setData(dataJson.map((d) => ({ ...d, id: d.id.split(" ")[0] })));
    }
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data[29]);

  const keys = Object.keys(data[0]);
  keys.splice(0, 1);

  const colors = [
    { key: "Close", value: "#97e3d5" },
    { key: "Day_Of_Week", value: "#61cdbb" },
    { key: "High_Low_Pct", value: "#f47560" },
    { key: "Month_Of_Year", value: "#e25c3b" },
    { key: "Open_Close_Pct", value: "#97e3d5" },
    { key: "Quarter_Of_Year", value: "#61cdbb" },
    { key: "Volume    ", value: "#f47560" },
  ];

  const labels = [
    { key: "Close", value: "Close" },
    { key: "Day_Of_Week", value: "Day_Of_Week" },
    { key: "High_Low_Pct", value: "High_Low_Pct" },
    { key: "Month_Of_Year", value: "Month_Of_Year" },
    { key: "Open_Close_Pct", value: "Open_Close_Pct" },
    { key: "Quarter_Of_Year", value: "Quarter_Of_Year" },
    { key: "Volume    ", value: "Volume" },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="id"
      margin={{ top: 50, right: 130, bottom: 50, left: 70 }}
      padding={0.1}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: false }}
      colors={["#97e3d5", "#61cdbb", "#f47560", "#e25c3b"]}
      // colors={{ scheme: "nivo" }}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
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
      // labelTextColor={{
      //   from: "color",
      //   modifiers: [["darker", 1.6]],
      // }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
    />
  );
};

export default MyResponsiveBar;
