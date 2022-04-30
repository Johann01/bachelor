import { ResponsiveLine } from "@nivo/line";
import { memo } from "react";
import * as d3Scale from "d3-scale-chromatic";
import * as d3 from "d3";
import { useStore } from "@utils/settingsStore";
import { useStore as useFeatureStore } from "@utils/store";
import { useColor } from "@components/Chart/utils";

const InputChart = memo(({ data: inputData }: any) => {
  const { inspectionViewData } = useStore();
  const { features } = useFeatureStore();
  const color = useColor();
  const colorAccessor = (d: any) => color(d.id);
  if (!features.length) return <div>Loading</div>;
  const data = inputData.filter(
    (d) => features.find((f) => f.name === d.id)!.activated === true
  );

  return (
    <div className="relative w-full h-64 grow">
      {data
        .filter((_, index) => index !== 0)
        .map((data) => (
          <div className="absolute top-0 w-full h-full" key={data[0]}>
            <ResponsiveLine
              data={[data]}
              margin={{ top: 10, right: 20, bottom: 30, left: 20 }}
              xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
              curve="monotoneX"
              yScale={{
                type: "linear",
                stacked: false,
                min: "auto",
                max: "auto",
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisLeft={null}
              axisBottom={null}
              isInteractive={false}
              colors={colorAccessor}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointLabelYOffset={-12}
              enableSlices="x"
              enableGridY={false}
              enableGridX={false}
              useMesh={false}
            />
          </div>
        ))}
      <div className="absolute top-0 w-full h-full">
        <ResponsiveLine
          data={[data[0]]}
          margin={{ top: 10, right: 20, bottom: 30, left: 20 }}
          xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
          curve="monotoneX"
          yScale={{
            type: "linear",
            stacked: true,
            min: "auto",
            max: "auto",
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisLeft={null}
          axisBottom={{
            tickValues: 3,
            tickPadding: 5,
            tickRotation: 0,
            format: "%Y-%m-%d",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          isInteractive={true}
          sliceTooltip={({ slice }) => {
            const index = Number(slice.points[0].id.split(".")[1]);
            const dataIndex = data.map((d) => {
              return { name: d.id, value: d.data[index].y };
            });
            return (
              <div className="z-10 p-3 text-center transition duration-100 ease-in-out bg-white border border-gray-400 rounded-md shadow-md ">
                <div className="font-bold ">{inspectionViewData[index]}</div>
                {dataIndex.map((d) => (
                  <div
                    className="flex flex-row items-center gap-2 mr-4"
                    key={d.name}
                  >
                    <div
                      className="w-4 h-4 rounded-md "
                      style={{ backgroundColor: color(d.name) }}
                    />
                    <p className="text-sm font-medium leading-6 text-gray-800">
                      {d.name}
                    </p>
                    {d.value}
                  </div>
                ))}
              </div>
            );
          }}
          colors={colorAccessor}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointLabelYOffset={-12}
          enableSlices="x"
          enableGridY={true}
          enableGridX={false}
          useMesh={false}
        />
      </div>
    </div>
  );
});

InputChart.displayName = "InputChart";

export default InputChart;
