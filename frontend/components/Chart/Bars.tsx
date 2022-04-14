import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType, useColor } from "./utils";
import Bin from "./Bin";

const Bars = ({
  data,
  keyAccessor,
  xScale,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  yScale,
  yScaleShapley,
  setOnMouseEnterData,
  height,
  ...props
}: any) => {
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(null);
  const color = useColor();

  const padding = 8;

  data.forEach((d) => {
    var y0 = 0;
    var y0Neg = 0;

    const orderPos = color
      .domain()
      .filter((name) => d[name] >= 0)
      .sort(function (a, b) {
        return d[b] - d[a];
      });
    const orderNeg = color
      .domain()
      .filter((name) => d[name] < 0)
      .sort(function (a, b) {
        return Math.abs(d[b]) - Math.abs(d[a]);
      });

    const shapleyValuesPos = orderPos.map((name) => {
      const y1 = y0;
      return { name: name, y0: (y0 += -d[name]), y1: y1 };
    });

    const shapleyValuesNeg = orderNeg.map((name) => {
      return { name: name, y0: y0Neg, y1: (y0Neg += -d[name]) };
    });

    d.shapleyValues = [...shapleyValuesPos, ...shapleyValuesNeg];
  });

  return (
    <>
      {data.map((dayData, index) => (
        <>
          {dayData.shapleyValues.map((d, i) => {
            return (
              <>
                <rect
                  key={i}
                  className="Bars__rect"
                  style={{ fill: color(d.name) }}
                  x={xScale(new Date(dayData.date)) + padding / 2}
                  y={
                    yScaleShapley(d.y1) +
                    yScale(dayData.temperaturePredicted) -
                    yScaleShapley(0)
                  }
                  width={xScale.bandwidth() - padding}
                  height={yScaleShapley(d.y0) - yScaleShapley(d.y1)}
                  // onMouseEnter={(event) => {
                  //   setHover(true);
                  //   setOnMouseEnterData(dayData);
                  // }}
                  // onMouseLeave={() => {
                  //   setHover(false);
                  //   setOnMouseEnterData(null);
                  // }}
                />
                <div>{d.name}</div>
              </>
            );
          })}
          <Bin
            index={index}
            x={xScale(new Date(dayData.date))}
            y={0}
            width={xScale.bandwidth()}
            height={height}
            selected={selected === dayData}
            onClick={() => setSelected(dayData)}
            data={dayData}
            setOnMouseEnterData={setOnMouseEnterData}
          />
        </>
      ))}
    </>
  );
};

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
};

Bars.defaultProps = {};

export default Bars;
