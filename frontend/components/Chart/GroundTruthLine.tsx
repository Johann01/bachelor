import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType } from "./utils";

const Line = ({ data, xAccessor, yAccessor, width, ...props }) => {
  const lineGenerator = d3
    .line()
    .x(xAccessor)
    .y(yAccessor)
    .curve(d3.curveStepAfter);

  const line = lineGenerator(data);
  const lineArray = line!.split("L");
  const lineArrayLastElement = lineArray[lineArray.length - 1].split(",");
  const lineExtend = [
    (Number(lineArrayLastElement[0]) + width).toString(),
    lineArrayLastElement[1],
  ];

  const newLine = [...lineArray, ...lineExtend].join(",");

  return (
    <path
      {...props}
      className={`Line Line--type-line stroke-slate-800 z-10`}
      d={newLine}
    />
  );
};

Line.propTypes = {
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
};

export default Line;
