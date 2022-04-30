// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";
import { useStore } from "@utils/settingsStore";
import { useColor } from "@components/Chart/utils";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const ModelView = () => {
  const [data, setData] = useState();
  const { model, xaiMethod, dataset, timestepSegment, inspectionViewData } =
    useStore();
  const color = useColor();
  const colorAccessor = (d: any) => color(d.indexValue);
  const theme = useTheme();
  useEffect(() => {
    async function fetchData() {
      if (!timestepSegment) return;
      const res = await fetch("http://localhost:3000/api/ModelData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          xaiMethod: xaiMethod.toLowerCase(),
          dataset,
          timestepSegment,
          startDate: inspectionViewData[timestepSegment[0]],
          endDate: inspectionViewData[timestepSegment[1]],
        }),
      });
      const data = await res.json();
      setData(data);
    }
    fetchData();
  }, [timestepSegment, model, xaiMethod, dataset]);

  if (!data || !timestepSegment) {
    return (
      <div className="flex items-center justify-center w-full h-full ">
        <span className="inline-block w-2 h-2 ml-2 bg-gray-500 rounded-full animate-flash"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.4s]"></span>
      </div>
    );
  }

  const keys = Object.keys(data.data[0]);
  keys.splice(0, 1);

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-base font-normal leading-6 text-gray-800">
          Model Overview
        </h2>
        <div className="flex p-2 mt-2 border border-gray-100 rounded-md bg-gray-50">
          <div className="flex flex-col w-full gap-1">
            <h5 className="text-xs font-medium leading-4 text-gray-700">
              RMSE
            </h5>
            <p className="text-sm font-bold leading-6 text-gray-800">
              {data.rmse!}
            </p>
          </div>
          <div className="flex flex-col w-full gap-1">
            <h5 className="text-xs font-medium leading-4 text-gray-700">MAE</h5>
            <p className="text-sm font-bold leading-6 text-gray-800">
              {data.mae!}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full pt-2 mt-2 border border-gray-100 rounded-md grow">
        <ResponsiveBar
          data={data.data}
          keys={keys}
          groupMode="grouped"
          indexBy="id"
          enableGridY={false}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          padding={0.05}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={colorAccessor}
          colorBy="indexValue"
          label={(d) => `${d.value?.toFixed(3)}`}
          borderRadius={4}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={function (e) {
            return (
              e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            );
          }}
        />
      </div>
    </div>
  );
};

export default ModelView;
