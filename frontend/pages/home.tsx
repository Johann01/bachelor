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
import * as Papa from "papaparse";
import fs from "fs";
const csv = require("csv-parser");

import dynamic from "next/dynamic";
import path from "path";

const InputChart = dynamic(() => import("@components/InputChart"), {
  ssr: false,
});

const InspectionChart = dynamic(() => import("@components/InspectionChart"), {
  ssr: false,
});

const Home: NextPage = ({ data }: any) => {
  return (
    <>
      <Layout>
        <div className="h-full bg-gray-100">
          <div className="h-screen py-10">
            <main className="h-full lg:max-w-[1600px] lg:px-8 lg:grid lg:grid-cols-12 lg:grid-rows-6 lg:gap-4 mx-auto">
              <div className="absolute px-4 py-6 translate-x-1/2 bg-white shadow lg:hidden top-1/2 sm:p-6 sm:rounded-lg">
                <h1 className="text-sm font-medium text-gray-900">
                  Please use a bigger screen size to show everything correctly
                </h1>
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-4 lg:row-span-3 sm:p-6 sm:rounded-lg">
                <InputChart data={data} />
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-4 lg:row-start-4 lg:row-span-3 sm:p-6 sm:rounded-lg">
                Model View
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-8 lg:row-span-4 sm:p-6 sm:rounded-lg">
                <InspectionChart />
                Inspection View
              </div>
              <div className="hidden lg:bg-white lg:shadow lg:block lg:col-span-8 lg:row-span-2 sm:p-6 sm:rounded-lg">
                History View
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
