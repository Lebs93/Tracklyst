// pages/investing.tsx

import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const InvestingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Investing • Finance App</title>
      </Head>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Investing</h1>

        {/* Portfolio Overview */}
        <section
          aria-labelledby="portfolio-overview-title"
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2
            id="portfolio-overview-title"
            className="text-lg font-medium mb-3"
          >
            Portfolio Overview
          </h2>
          <p className="text-gray-500">
            You haven’t added any investments yet. Future snapshots of your
            holdings will appear here.
          </p>
        </section>

        {/* Market News */}
        <section
          aria-labelledby="market-news-title"
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 id="market-news-title" className="text-lg font-medium mb-3">
            Market News
          </h2>
          <ul className="list-disc list-inside text-gray-500">
            <li>Feature coming soon: live market data.</li>
            <li>Feature coming soon: personalized insights.</li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default React.memo(InvestingPage);
