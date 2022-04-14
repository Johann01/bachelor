// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

import { Chip, TableTooltip } from "@nivo/tooltip";
import type { SliceTooltipProps } from "@nivo/line";
import { useTheme } from "@nivo/core";
import HistoryChart from "./HistoryChart";
import HistoryChartLine from "./HistoryChartLine";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const HistoryView = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-col w-full h-full">
          <h2 className="text-base font-normal leading-6 text-gray-800">
            History View
          </h2>
          <div className="flex justify-center w-full">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={classNames(
                enabled ? "bg-blue-600" : "bg-gray-200",
                "relative inline-flex flex-shrink-0 h-6 w-[5.25rem] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                className={classNames(
                  enabled ? "translate-x-10" : "translate-x-0",
                  "pointer-events-none relative inline-block h-5 w-10 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              >
                <span
                  className={classNames(
                    enabled
                      ? "opacity-0 ease-out duration-100"
                      : "opacity-100 ease-in duration-200",
                    "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                  )}
                  aria-hidden="true"
                >
                  bar
                </span>
                <span
                  className={classNames(
                    enabled
                      ? "opacity-100 ease-in duration-200"
                      : "opacity-0 ease-out duration-100",
                    "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                  )}
                  aria-hidden="true"
                >
                  line
                </span>
              </span>
            </Switch>
          </div>
        </div>
      </div>
      {enabled ? <HistoryChart /> : <HistoryChartLine />}
    </>
  );
};

export default HistoryView;
