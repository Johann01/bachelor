import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const xai = [{ name: "LIME" }, { name: "DeepLift" }];

import { useStore } from "@utils/settingsStore";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SelectorIcon,
} from "@heroicons/react/outline";

function SelectMenu() {
  const { sequenceLength, setSequenceLength } = useStore();

  return (
    <div className="w-full sm:col-span-2">
      <div>
        <div className="flex w-full mt-1 rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              type="number"
              name="number"
              id="number"
              min={0}
              max={100}
              className="block w-full pl-2 border border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-sm"
              value={sequenceLength}
              onChange={(e) => {
                console.log(e);
                setSequenceLength(Number(e.target.value));
              }}
            />
          </div>
          <div className="relative inline-flex items-center -ml-px text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md">
            <button
              type="button"
              className="py-2 px-1/2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              onClick={(event) => {
                setSequenceLength(Number(sequenceLength) - 1);
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
              onClick={(event) => {
                setSequenceLength(Number(sequenceLength) + 1);
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
    </div>
  );
}

export default SelectMenu;
