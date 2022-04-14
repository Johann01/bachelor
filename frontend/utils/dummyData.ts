import * as d3 from "d3";

const randomAroundMean = (mean, deviation) =>
  mean + boxMullerRandom() * deviation;
const boxMullerRandom = () =>
  Math.sqrt(-2.0 * Math.log(Math.random())) *
  Math.cos(2.0 * Math.PI * Math.random());

const today = new Date();
const formatDate = d3.timeFormat("%m/%d/%Y");
export const getTimelineData = (length = 100) => {
  let lastTemperature = randomAroundMean(70, 20);
  const firstTemperature = d3.timeDay.offset(today, -length);

  return new Array(length).fill(0).map((d, i) => {
    lastTemperature += randomAroundMean(0, 2);
    return {
      date: formatDate(d3.timeDay.offset(firstTemperature, i)),
      temperature: lastTemperature,
    };
  });
};

export const getScatterData = (count = 100) =>
  new Array(count).fill(0).map((d, i) => ({
    temperature: randomAroundMean(70, 20),
    humidity: randomAroundMean(0.5, 0.1),
  }));

export const getShapleyValueData = (length = 30) => {
  let lastTemperatureGroundTruth = randomAroundMean(70, 20);
  let lastTemperaturePredicted = randomAroundMean(70, 20);
  const firstTemperature = d3.timeDay.offset(today, -length);

  return new Array(length).fill(0).map((d, i) => {
    lastTemperatureGroundTruth += randomAroundMean(0, 2);
    lastTemperaturePredicted += randomAroundMean(0, 2);
    return {
      date: formatDate(d3.timeDay.offset(firstTemperature, i)),
      temperaturePredicted: lastTemperatureGroundTruth,
      temperatureGroundTruth: lastTemperaturePredicted,
      temperature: randomAroundMean(0, 1),
      humidity: randomAroundMean(0, 1),
      weather: randomAroundMean(0, 1),
      carbonDioxide: randomAroundMean(0, 1),
      rain: randomAroundMean(0, 1),
    };
  });
};
