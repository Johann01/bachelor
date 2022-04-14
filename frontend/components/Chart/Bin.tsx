import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType, callAccessor } from "./utils";
import Line from "./Line";
import { usePopper } from "react-popper";

const Bin = ({
  index,
  x,
  y,
  width,
  height,
  selected,
  onClick,
  setOnMouseEnterData,
  data,
  ...props
}: any) => {
  const [hover, setHover] = useState(false);

  const classNameLine = `${
    selected
      ? "stroke-slate-800"
      : `${hover ? "stroke-slate-500" : "stroke-transparent"}`
  }`;

  return (
    <>
      <rect
        {...props}
        className="fill-transparent"
        key={index}
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseEnter={(event, d) => {
          setHover(true);
          setOnMouseEnterData(data);
        }}
        onMouseLeave={() => {
          setHover(false);
          setOnMouseEnterData(null);
        }}
        onClick={onClick}
      />
      <Line className={classNameLine} x1={x} y1={y} x2={x + width} y2={y} />
      <Line
        className={classNameLine}
        x1={x}
        y1={y + height}
        x2={x + width}
        y2={y + height}
      />
      <Line className={classNameLine} x1={x} y1={y} x2={x} y2={y + height} />
      <Line
        className={classNameLine}
        x1={x + width}
        y1={y}
        x2={x + width}
        y2={y + height}
      />
    </>
  );
};

Bin.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
};

Bin.defaultProps = {};

export default Bin;
