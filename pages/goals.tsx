// pages/goals.tsx

import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const GoalsPage: NextPage = () => (
  <>
    <Head>
      <title>Goals • Finance App</title>
    </Head>
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Goals</h1>

      {/* Monthly Goals Section */}
      <section
        aria-labelledby="monthly-goals-title"
        className="bg-white p-6 rounded-lg shadow"
      >
        <h2
          id="monthly-goals-title"
          className="text-lg font-medium mb-2"
        >
          Monthly Goals
        </h2>
        <p className="text-gray-500">
          No goals set yet. You can define savings, spending, or investment targets here.
        </p>
      </section>

      {/* Features Placeholder Section */}
      <section
        aria-labelledby="goals-features-title"
        className="bg-white p-6 rounded-lg shadow"
      >
        <h2
          id="goals-features-title"
          className="text-lg font-medium mb-2"
        >
          Upcoming Features
        </h2>
        <ul className="list-disc list-inside text-gray-500 space-y-1">
          <li>Define and track custom goals</li>
          <li>Progress bars and charts</li>
          <li>Deadline reminders and notifications</li>
        </ul>
      </section>
    </main>
  </>
);

export default React.memo(GoalsPage);
