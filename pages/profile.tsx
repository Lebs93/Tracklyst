// pages/profile.tsx

import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { User } from "lucide-react";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile • Finance App</title>
      </Head>
      <main className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        {/* Account Information */}
        <section
          aria-labelledby="profile-info-title"
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2
            id="profile-info-title"
            className="text-lg font-medium mb-2"
          >
            Account Info
          </h2>
          <div className="flex items-center space-x-4">
            <User
              className="w-8 h-8 text-green-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Luca Celebre</p>
              <p className="text-gray-500">luca@example.com</p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section
          aria-labelledby="preferences-title"
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2
            id="preferences-title"
            className="text-lg font-medium mb-2"
          >
            Preferences
          </h2>
          <p className="text-gray-500">
            Notification settings and theme options will appear here soon.
          </p>
        </section>
      </main>
    </>
  );
};

export default React.memo(ProfilePage);
