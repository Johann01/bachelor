import { ResponsiveLine } from "@nivo/line";
import * as Slider from "@radix-ui/react-slider";
import { styled } from "@stitches/react";
import * as d3 from "d3";
import * as d3Scale from "d3-scale-chromatic";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SortAscendingIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import InputChart from "./InputChart";
import { useStore } from "@utils/settingsStore";
import { SaveIcon } from "@heroicons/react/outline";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyResponsiveLine = ({ data }: any) => {
  const {
    timestepSegment,
    setInspectionView,
    setTimestepSegment,
    model,
    xaiMethod,
    dataset,
  } = useStore();
  const [value, setValue] = useState([0, 30]);

  useEffect(() => {
    const value = !data
      ? [0, 30]
      : [data[0].data.length - 20, data[0].data.length - 1];
    setValue(value);
    fetch("http://localhost:3000/api/PrepareData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        xaiMethod,
        dataset,
        sequenceLength: value,
      }),
    })
      .then((res) => {
        setTimestepSegment(value);
        setInspectionView("Global");
      })
      .catch((err) => console.log(err));
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const maxValue = data[0].data.length - 1;

  return (
    <div className="flex flex-col h-full">
      <InputChart data={data} />
      <div>
        <div className="pt-2">
          <Slider.Root
            className="relative flex items-center w-full h-5"
            min={0}
            max={maxValue}
            value={value}
            minStepsBetweenThumbs={1}
            onValueChange={(value) => setValue(value)}
          >
            <Slider.Track className="relative flex-grow h-1 bg-gray-200 rounded-full">
              <Slider.Range className="absolute h-full bg-gray-400 rounded-full shadow-lg" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white border border-gray-300 shadow-lg rounded-xl focus:border-gray-400 focus:outline-none" />
            <Slider.Thumb className="block w-5 h-5 bg-white border border-gray-300 shadow-lg rounded-xl focus:border-gray-400 focus:outline-none" />
          </Slider.Root>
        </div>
        <div className="flex flex-row items-end space-x-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <div className="flex w-full mt-1 rounded-md shadow-sm">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <input
                  type="start-date"
                  name="start-date"
                  id="start-date"
                  className="block w-full pl-2 border border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-sm"
                  value={data[0].data[value[0]].x}
                  placeholder="Start Date"
                  readOnly
                />
              </div>
              <div className="relative inline-flex items-center -ml-px text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="py-2 px-1/2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => {
                    setValue([value[0] - 1, value[1]]);
                  }}
                >
                  <ChevronLeftIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="py-2 px-1/2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md"
                  onClick={() => {
                    setValue([value[0] + 1, value[1]]);
                  }}
                >
                  <ChevronRightIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <div className="flex w-full mt-1 rounded-md shadow-sm">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <input
                  type="end-date"
                  name="end-date"
                  id="end-date"
                  className="block w-full pl-2 border border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-sm"
                  value={data[0].data[value[1]].x}
                  placeholder="End Date"
                  readOnly
                />
              </div>
              <div className="relative inline-flex items-center -ml-px text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md">
                <button
                  type="button"
                  className="py-2 px-1/2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => {
                    setValue([value[0], value[1] - 1]);
                  }}
                >
                  <ChevronLeftIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="py-2 px-1/2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md"
                  onClick={() => {
                    setValue([value[0], value[1] + 1]);
                  }}
                >
                  <ChevronRightIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-3 text-xs font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                fetch("http://localhost:3000/api/PrepareData", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model,
                    xaiMethod,
                    dataset,
                    sequenceLength: value,
                  }),
                })
                  .then((res) => {
                    setTimestepSegment(value);
                    setInspectionView("Global");
                  })
                  .catch((err) => console.log(err));
              }}
            >
              <SaveIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResponsiveLine;
