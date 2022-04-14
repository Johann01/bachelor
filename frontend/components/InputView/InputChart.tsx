import { ResponsiveLine } from "@nivo/line";
import { memo } from "react";
import * as d3Scale from "d3-scale-chromatic";
import * as d3 from "d3";

const InputChart = memo(({ data }: any) => {
  const keys = Object.keys(data[0]);
  var color = d3.scaleOrdinal().domain(keys).range(d3Scale.schemeSet3);

  return (
    <div className="w-full h-64 grow">
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
    </div>
  );
});

InputChart.displayName = "InputChart";

export default InputChart;
