import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType, useColor } from "./utils";
import Bin from "./Bin";
import { useStore } from "@utils/settingsStore";

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
  xAccessorScaled,
  ...props
}: any) => {
  const { setInspectionView } = useStore();
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(null);
  const color = useColor();

  const padding = 8;

  const handleClick = (d: any) => {
    setSelected(d);
    setInspectionView(d.timestep);
  };

  data
    .map((d) => d.shapleyValue)
    .forEach((d, index) => {
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

      data[index].shaplingDrawing = [...shapleyValuesPos, ...shapleyValuesNeg];
    });

  return (
    <>
      {data.map((dayData, index) => (
        <>
          {dayData.shaplingDrawing.map((d, i) => {
            return (
              <>
                <rect
                  key={i}
                  className="Bars__rect"
                  style={{ fill: color(d.name) }}
                  x={xAccessor(dayData) + padding / 2}
                  y={
                    yScaleShapley(d.y1) +
                    yScale(dayData.prediction) -
                    yScaleShapley(0)
                  }
                  width={xScale.bandwidth() - padding}
                  height={yScaleShapley(d.y0) - yScaleShapley(d.y1)}
                />
                <div>{d.name}</div>
              </>
            );
          })}
          <Bin
            index={index}
            x={xAccessor(dayData)}
            y={0}
            width={xScale.bandwidth()}
            height={height}
            selected={selected === dayData}
            onClick={() => handleClick(dayData)}
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
