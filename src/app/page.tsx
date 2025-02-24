// app/dashboard/page.tsx
"use client";

import React from "react";

// Static sample data for today's stats.
const covidData = [
  {
    id: "1",
    country: "Australia",
    region: "Oceania",
    confirmed: 20000,
    deaths: 500,
    recovered: 19000,
    updatedAt: new Date().toLocaleString(),
  },
  {
    id: "2",
    country: "USA",
    region: "North America",
    confirmed: 250000,
    deaths: 10000,
    recovered: 230000,
    updatedAt: new Date().toLocaleString(),
  },
  {
    id: "3",
    country: "Italy",
    region: "Europe",
    confirmed: 150000,
    deaths: 9000,
    recovered: 140000,
    updatedAt: new Date().toLocaleString(),
  },
];

// Calculate global totals from the static data.
const covidTotals = {
  confirmed: covidData.reduce((acc, curr) => acc + curr.confirmed, 0),
  deaths: covidData.reduce((acc, curr) => acc + curr.deaths, 0),
  recovered: covidData.reduce((acc, curr) => acc + curr.recovered, 0),
};

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-center text-4xl font-bold">
          COVID‑19 Daily Overview
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Stay updated with the latest COVID‑19 statistics and travel risk
          advisories.
        </p>
      </header>

      {/* Global Summary Cards */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Global Summary for Today
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-blue-700">
              Confirmed Cases
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {covidTotals.confirmed.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-red-600">Deaths</h3>
            <p className="mt-2 text-3xl font-bold">
              {covidTotals.deaths.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-green-600">Recovered</h3>
            <p className="mt-2 text-3xl font-bold">
              {covidTotals.recovered.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Table */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Detailed Statistics by Country
        </h2>
        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Region
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Confirmed
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Deaths
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Recovered
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {covidData.map((stat) => (
                <tr key={stat.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {stat.country}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{stat.region}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {stat.confirmed.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {stat.deaths.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {stat.recovered.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {stat.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Important Information Banner */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Important Information & Recommendations
        </h2>
        <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="text-blue-700">
            Based on today's statistics, travel to high-infection regions is
            discouraged unless absolutely necessary. Ensure you follow all local
            guidelines and take necessary precautions such as wearing masks,
            regular hand hygiene, and maintaining social distancing.
          </p>
        </div>
      </section>
    </div>
  );
}
