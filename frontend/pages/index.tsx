import Header from "@components/Header";
import {
  FireIcon,
  HomeIcon,
  TrendingUpIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import Layout from "@components/layouts/Layout";
import { NextPage } from "next";
import { useEffect } from "react";

const csv = require("csv-parser");

import dynamic from "next/dynamic";

import InspectionView from "@components/InspectionView";
import InputView from "@components/InputView";

import { useStore } from "../utils/store";
import { useStore as useSettingsStore } from "../utils/settingsStore";
import ModelView from "@components/ModelView";
import HistoryView from "@components/HistoryView";

const Home: NextPage = ({ data }: any) => {
  const { addFeature, setTargetFeature } = useStore();
  const { setInspectionViewData } = useSettingsStore();

  useEffect(() => {
    setTargetFeature(data[0].id);
    data.forEach((d: any) => {
      addFeature(d.id);
    });

    setInspectionViewData(data[0].data.map((d: any) => d["x"]));

    return () => {};
  }, []);

  return (
    <>
      <Layout>
        <div className="h-screen bg-gray-100">
          <div className="h-screen py-10">
            <main className="h-full lg:w-[1600px] lg:px-8 lg:grid lg:grid-cols-12 lg:grid-rows-6 lg:gap-4 mx-auto">
              <div className="absolute px-4 py-6 translate-x-1/2 bg-white shadow lg:hidden top-1/2 sm:p-4 sm:rounded-lg">
                <h1 className="text-sm font-medium text-gray-900">
                  Please use a bigger screen size to show everything correctly
                </h1>
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-4 lg:row-span-3 sm:p-4 sm:rounded-lg">
                <InputView data={data} />
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-4 lg:row-start-4 lg:row-span-3 sm:p-4 sm:rounded-lg">
                <ModelView />
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-8 lg:row-span-4 sm:p-4 sm:rounded-lg">
                <InspectionView data={data} />
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-8 lg:row-span-2 sm:p-4 sm:rounded-lg">
                <HistoryView />
              </div>
              <div className="hidden col-span-9 row-span-9 xl:col-span-6"></div>
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/InputData");
  const { data } = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default Home;
