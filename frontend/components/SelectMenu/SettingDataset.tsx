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
  const { dataset, setDataset } = useStore();

  return (
    <div className="w-full sm:col-span-2">
      <div>
        <div className="flex w-full mt-1 rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              type="text"
              name="text"
              id="text"
              className="block w-full py-2 pl-2 border border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-md"
              value={dataset}
              onChange={(e) => {
                console.log(e);
                setDataset(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectMenu;
