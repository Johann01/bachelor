// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";

import { useStore } from "@utils/store";
import { useStore as useSettingsStore } from "@utils/settingsStore";
import Timeline from "@components/Chart/Timeline";
import { useColor } from "@components/Chart/utils";

const InspectionView = ({}) => {
  const [data, setData] = useState();
  const { features, updateFeature, targetFeature } = useStore();
  const { model, xaiMethod, dataset, timestepSegment, inspectionViewData } =
    useSettingsStore();
  const color = useColor();

  useEffect(() => {
    async function fetchData() {
      if (!timestepSegment) return;
      const res = await fetch("http://localhost:3000/api/InspectionData", {
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
      const { data } = await res.json();
      setData(data);
    }
    fetchData();
  }, [timestepSegment, model, xaiMethod, dataset]);

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-base font-normal leading-6 text-gray-800">
          Inspection View
        </h2>
        <div className="flex flex-wrap justify-start gap-4 p-2 mt-2 border border-gray-100 rounded-md ">
          <div
            className="flex flex-row items-center gap-2 mr-4"
            key={targetFeature.name}
          >
            <h3 className="text-base font-normal leading-6 text-gray-600">
              Target Feature:
            </h3>
            <div
              className="w-4 h-4 rounded-md "
              style={{ backgroundColor: color(targetFeature.name) }}
            />
            <p className="text-sm font-medium leading-6 text-gray-800">
              {targetFeature.name}
            </p>
          </div>
          {features
            .filter((f) => f.name !== targetFeature.name)
            .map((f, index) => (
              <div className="flex flex-row items-center gap-1" key={f.name}>
                <div
                  className="w-4 h-4 rounded-md "
                  style={{ backgroundColor: color(f.name) }}
                />
                <p className="text-sm font-medium leading-6 text-gray-800">
                  {f.name}
                </p>
              </div>
            ))}
        </div>
      </div>
      {!data || !timestepSegment ? (
        <div className="flex items-center justify-center w-full h-full ">
          <span className="inline-block w-2 h-2 ml-2 bg-gray-500 rounded-full animate-flash"></span>
          <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 ml-2 rounded-full bg-gray-500 inline-block animate-flash [animation-delay:0.4s]"></span>
        </div>
      ) : (
        <Timeline data={data} />
      )}
    </div>
  );
};

export default InspectionView;
