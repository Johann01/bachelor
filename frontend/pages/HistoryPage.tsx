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

import InputView from "@components/InputView";

import { useStore } from "../utils/store";
import ModelView from "@components/ModelView";
import HistoryView from "@components/HistoryView";
import { useColor } from "@components/Chart/utils";

const Home: NextPage = ({ data }: any) => {
  const { addFeature, setTargetFeature } = useStore();

  useEffect(() => {
    setTargetFeature(data[0].id);
    data.forEach((d: any) => {
      addFeature(d.id);
    });

    return () => {};
  }, []);

  return (
    <>
      <Layout>
        <div className="h-screen bg-gray-100">
          <div className="h-screen py-10">
            <main className="grid w-full h-full grid-cols-12 grid-rows-6 gap-4 px-8 mx-auto">
              <div className="block col-span-12 row-span-6 bg-white shadow sm:p-4 sm:rounded-lg">
                <HistoryView data={data} />
              </div>
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
