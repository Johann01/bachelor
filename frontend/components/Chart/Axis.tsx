import React, { useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import { useDimensionsContext } from "./Chart";

const formatMillisecond = d3.timeFormat(".%L"),
  formatSecond = d3.timeFormat(":%S"),
  formatMinute = d3.timeFormat("%I:%M"),
  formatHour = d3.timeFormat("%I %p"),
  formatDay = d3.timeFormat("%a %d"),
  formatWeek = d3.timeFormat("%b %d"),
  formatMonth = d3.timeFormat("%B"),
  formatYear = d3.timeFormat("%Y");

function multiFormat(date) {
  return (
    d3.timeSecond(date) < date
      ? formatMillisecond
      : d3.timeMinute(date) < date
      ? formatSecond
      : d3.timeHour(date) < date
      ? formatMinute
      : d3.timeDay(date) < date
      ? formatHour
      : d3.timeMonth(date) < date
      ? d3.timeWeek(date) < date
        ? formatDay
        : formatWeek
      : d3.timeYear(date) < date
      ? formatMonth
      : formatYear
  )(date);
}

const Axis = ({ dimension, scale, ...props }) => {
  const dimensions = useDimensionsContext();
  const ref = useRef();

  const axisGeneratorsByDimension = {
    x: "axisBottom",
    y: "axisLeft",
  };
  const axisGenerator = d3[axisGeneratorsByDimension[dimension]]().scale(scale);

  if (dimension === "x") {
    axisGenerator.tickFormat(multiFormat);
  }

  if (ref.current) {
    d3.select(ref.current).transition().call(axisGenerator);
  }

  return (
    <g
      {...props}
      className="Axis"
      ref={ref}
      transform={
        dimension == "x" ? `translate(0, ${dimensions.boundedHeight})` : null
      }
    />
  );
};

Axis.propTypes = {
  dimension: PropTypes.oneOf(["x", "y"]),
  scale: PropTypes.func,
};

const formatNumber = d3.format(",");
Axis.defaultProps = {
  dimension: "x",
};

export default Axis;
