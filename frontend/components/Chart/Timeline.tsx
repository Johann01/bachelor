import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "./Chart";
import Axis from "./Axis";
import { useChartDimensions, accessorPropsType } from "./utils";
import PredictedLine from "./PredictedLine";
import GroundTruthLine from "./GroundTruthLine";
import Bars from "./Bars";
import { useStore } from "@utils/store";
import Tooltip from "./Tooltip";

const Timeline = ({ data, xAccessor, yAccessor, label }) => {
  const { features } = useStore();
  const [onMouseEnterData, setOnMouseEnterData] = React.useState(null);

  const [ref, dms] = useChartDimensions();

  const xScale = d3
    .scaleBand()
    .domain(data.map(xAccessor))
    .range([0, dms.boundedWidth]);

  const min = d3.min(data, (d) =>
    d3.min([d.temperatureGroundTruth, d.temperaturePredicted])
  );
  const max = d3.max(data, (d) =>
    d3.max([d.temperatureGroundTruth, d.temperaturePredicted])
  );

  const yScale = d3
    .scaleLinear()
    .domain([min - Math.abs(min) * 0.2, max + Math.abs(max) * 0.2])
    .range([dms.boundedHeight, 0])
    .nice();

  const yScaleShapley = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) =>
        d3.min([d.temperature, d.humidity, d.weather, d.carbonDioxide, d.rain])
      ),
      d3.max(data, (d) =>
        d3.max([d.temperature, d.humidity, d.weather, d.carbonDioxide, d.rain])
      ),
    ])
    .range([dms.boundedHeight * (1 / features.length), 0]);

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));

  const x = !onMouseEnterData ? null : xScale(onMouseEnterData.date);
  const y = !onMouseEnterData ? null : dms.boundedHeight / 2;

  return (
    <div className="relative w-full h-full Timeline" ref={ref}>
      <Chart dimensions={dms}>
        <Bars
          data={data}
          xScale={xScale}
          yScaleShapley={yScaleShapley}
          yScale={yScale}
          xAccessor={xAccessorScaled}
          setOnMouseEnterData={setOnMouseEnterData}
          height={dms.boundedHeight}
        />
        <PredictedLine
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={(d) => yScale(d.temperaturePredicted)}
          width={xScale.bandwidth()}
        />

        <GroundTruthLine
          data={data}
          xAccessor={xAccessorScaled}
          yAccessor={(d) => yScale(d.temperatureGroundTruth)}
          width={xScale.bandwidth()}
        />

        <Axis dimension="x" scale={xScale} />
        <Axis dimension="y" scale={yScale} />
      </Chart>
      {onMouseEnterData ? (
        <Tooltip
          x={
            xScale(new Date(onMouseEnterData.date)) +
            xScale.bandwidth() +
            192 / 2
          }
          y={dms.boundedHeight / 2 - 192 / 2}
          data={onMouseEnterData}
        />
      ) : null}
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string,
};

Timeline.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};

export default Timeline;
