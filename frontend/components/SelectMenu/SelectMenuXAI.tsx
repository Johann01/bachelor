import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const xai = [{ name: "LIME" }, { name: "DeepLift" }];

import { useStore } from "@utils/settingsStore";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";

function SelectMenu() {
  const { xaiMethod, setXAIMethod } = useStore();
  const [selected, setSelected] = useState(
    xai.filter((f) => f.name === xaiMethod)[0]
  );

  const handleOnChange = (xaiMethod: string) => {
    setXAIMethod(xaiMethod.name);
    setSelected(xaiMethod.name);
  };

  return (
    <div className="w-full sm:col-span-2">
      <Listbox value={selected} onChange={handleOnChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-2 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:shadow-outline-blue focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
            <span className="block truncate">{selected.name}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg focus:outline-none max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm">
              {xai.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default SelectMenu;
