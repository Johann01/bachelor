import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import SettingsView from "@components/SettingsView";

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <SettingsView open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex justify-center flex-shrink-0 w-full h-16 bg-white shadow">
            <div className="flex items-center justify-between flex-1 w-full px-4 max-w-7xl">
              <div className="w-full"></div>
              <button
                type="button"
                className="h-full px-4 text-gray-500 border-l border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:text-gray-600 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <CogIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
