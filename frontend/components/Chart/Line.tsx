import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType, callAccessor } from "./utils";

const Line = ({ x1, y1, x2, y2, ...props }: any) => {
  const strokeWidth = 4;

  return (
    <>
      <line
        {...props}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={strokeWidth}
        strokeDasharray={`${strokeWidth * 2} ${strokeWidth * 2}`}
        strokeLinecap="round"
      />
    </>
  );
};

export default Line;
