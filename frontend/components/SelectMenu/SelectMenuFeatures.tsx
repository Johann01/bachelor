import React from "react";
import { Listbox, Combobox } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { Feature, useStore } from "@utils/store";

function SelectMenu() {
  const { features, updateFeature } = useStore();
  const selectedFeatures = features.filter((f) => f.activated === true);

  const handleOnChange = (selectedFeaturesNew: Feature) => {
    updateFeature({ ...selectedFeaturesNew, activated: true });
  };

  return (
    <div className="w-full sm:col-span-2">
      <Listbox
        value={selectedFeatures}
        onChange={handleOnChange}
        name="features"
      >
        <div className="relative">
          <span className="inline-block w-full rounded-md shadow-sm">
            <Listbox.Button className="relative w-full py-2 pl-2 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:shadow-outline-blue focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
              <span className="flex flex-wrap block gap-2">
                {selectedFeatures.length === 0 ? (
                  <span className="p-0.5">Empty</span>
                ) : (
                  selectedFeatures.map((person) => (
                    <span
                      key={person.name}
                      className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5"
                    >
                      <span>{person.name}</span>
                      <svg
                        className="w-4 h-4 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateFeature({
                            ...person,
                            activated: !person.activated,
                          });
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  ))
                )}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Listbox.Button>
          </span>

          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            <Listbox.Options className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
              {features.map((person) => (
                <Listbox.Option
                  key={person.name}
                  value={person}
                  className={({ active }) => {
                    return classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9 focus:outline-none",
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    );
                  }}
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected ? "font-semibold" : "font-normal"
                        )}
                      >
                        {person.name}
                      </span>
                      {person.activated && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-blue-600" : "text-blue-600"
                          )}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </div>
      </Listbox>
    </div>
  );
}

export default SelectMenu;
