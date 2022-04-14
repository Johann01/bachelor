// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";
import * as d3Scale from "d3-scale-chromatic";
import * as d3 from "d3";
import { Axis } from "@components/Chart";
import Chart from "@components/Chart/Chart";
import Histogram from "@components/Chart/Histogram";
import {
  getScatterData,
  getShapleyValueData,
  getTimelineData,
} from "@utils/dummyData";
import { useStore } from "@utils/store";
import Timeline from "@components/Chart/Timeline";

const humidityAccessor = (d) => d.humidity;
const parseDate = d3.timeParse("%m/%d/%Y");
const dateAccessor = (d) => parseDate(d.date);
const temperatureAccessor = (d) => d.temperatureGroundTruth;

const getData = () => ({
  timeline: getTimelineData(),
  scatter: getScatterData(),
  shapleyValue: getShapleyValueData(),
});
const InspectionView = ({}) => {
  const [data, setData] = useState(getData());
  const { features, updateFeature, targetFeature } = useStore();

  if (!data) {
    return <div>Loading...</div>;
  }

  var color = d3
    .scaleOrdinal()
    .domain(features.map((f) => f.name))
    .range(d3Scale.schemeSet3);

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
      <Timeline
        data={data.shapleyValue}
        xAccessor={dateAccessor}
        yAccessor={temperatureAccessor}
        label="Temperature"
      />
    </div>
  );
};

export default InspectionView;
