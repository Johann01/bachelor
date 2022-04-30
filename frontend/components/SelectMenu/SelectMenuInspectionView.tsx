import React, { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const xai = [{ name: "LIME" }, { name: "DeepLift" }];

import { useStore } from "@utils/settingsStore";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";

function SelectMenu() {
  const { inspectionView, inspectionViewData, setInspectionView } = useStore();
  const [selected, setSelected] = useState();

  useEffect(() => {
    setSelected(inspectionView);

    return () => {};
  }, [inspectionView]);

  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? ["Global"]
      : inspectionViewData
          .filter((date) =>
            date
              .toLowerCase()
              .replace(/\s+/g, "")
              .startsWith(query.toLowerCase().replace(/\s+/g, ""))
          )
          .slice(0, 100);

  const handleOnChange = (date: string) => {
    setSelected(date);
    setInspectionView(date);
  };

  return (
    <div className="w-full sm:col-span-2">
      <Combobox value={selected} onChange={handleOnChange}>
        <div className="relative mt-1">
          <div className="relative w-full py-2 pl-2 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:shadow-outline-blue focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
              displayValue={(person) => person}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg focus:outline-none max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((date) => (
                  <Combobox.Option
                    key={date}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={date}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {date}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-blue-600"
                            }`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default SelectMenu;
