import Header from "@components/Header";
import Head from "next/head";
import { FC } from "react";

const Layout: FC<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>
          {title ||
            "Visualization_of_Explainable_AIMethods_for_Multivariate_Time_SeriesForecasts_blitz"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {children}
    </>
  );
};

export default Layout;
