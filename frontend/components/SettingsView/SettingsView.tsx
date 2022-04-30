import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  LinkIcon,
  PlusSmIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import {
  SelectMenuFeatures,
  SelectMenuInspectionView,
  SelectMenuXAI,
  SettingDataset,
  SettingSequenceLength,
} from "@components/SelectMenu";
import { useStore } from "@utils/settingsStore";
import { useStore as useFeatureStore } from "@utils/store";

const SettingsView = ({ open, setOpen }) => {
  const {
    xaiMethod,
    setXAIMethod,
    inspectionView,
    setInspectionView,
    inspectionViewData,
    timestepSegment,
    dataset,
    model,
  } = useStore();
  const { features, updateFeature } = useFeatureStore();
  const [loading, setLoading] = useState(false);

  const [xai, setXAI] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [inspectionViewState, setInspectionViewState] = useState("");

  useEffect(() => {
    setXAI(xaiMethod);
    setSelectedFeatures(features.filter((f) => f.activated === true));
    setInspectionViewState(inspectionView);
  }, [xaiMethod, features, inspectionView]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl pointer-events-auto">
                <form className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="px-4 py-6 bg-gray-50 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {" "}
                            Settings{" "}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            Adjust the settings for the inspection View and
                            Features.
                          </p>
                        </div>
                        <div className="flex items-center h-7">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider container */}
                    <div className="py-6 space-y-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                      {/* Feature Selection */}
                      <div className="px-4 space-y-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            XAI Method
                          </label>
                        </div>
                        <SelectMenuXAI xai={xai} setXAI={setXAI} />
                      </div>

                      <div className="px-4 space-y-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Features
                          </label>
                        </div>
                        <SelectMenuFeatures
                          features={features}
                          selectedFeatures={selectedFeatures}
                          setSelectedFeatures={setSelectedFeatures}
                        />
                      </div>
                      <div className="px-4 space-y-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Inspection View
                          </label>
                        </div>
                        <SelectMenuInspectionView
                          inspectionViewState={inspectionViewState}
                          setInspectionViewState={setInspectionViewState}
                          inspectionViewData={inspectionViewData}
                        />
                      </div>

                      {/* Project description */}
                      <div className="px-4 space-y-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5"></div>
                    </div>
                  </div>

                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      disabled={loading}
                      onClick={(event) => {
                        event.preventDefault();
                        setLoading(true);
                        if (features !== selectedFeatures) {
                          features.forEach((feature) => {
                            if (selectedFeatures.includes(feature)) {
                              updateFeature({
                                ...feature,
                                activated: true,
                              });
                            } else {
                              updateFeature({
                                ...feature,
                                activated: false,
                              });
                            }
                          });
                        }
                        setInspectionView(inspectionViewState);
                        if (timestepSegment && xai !== xaiMethod) {
                          fetch("http://localhost:3000/api/PrepareData", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              model,
                              xaiMethod: xai,
                              dataset,
                              sequenceLength: timestepSegment,
                            }),
                          })
                            .then((res) => {
                              setXAIMethod(xai);

                              // const handleOnChange = (xaiMethod: string) => {

                              //   setSelected(xaiMethod);
                              //   setXAIMethod(xaiMethod.name);
                              // };{
                            })
                            .catch((err) => console.log(err));
                        }
                        setLoading(false);
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center w-full h-full ">
                          <span className="inline-block w-2 h-2 ml-2 bg-gray-200 rounded-full animate-flash"></span>
                          <span className="w-2 h-2 ml-2 rounded-full bg-gray-200 inline-block animate-flash [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 ml-2 rounded-full bg-gray-200 inline-block animate-flash [animation-delay:0.4s]"></span>
                        </div>
                      ) : (
                        <>Save</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default SettingsView;
