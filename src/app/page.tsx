"use client";

import { useQuery } from "@tanstack/react-query";
import type { CovidStat } from "@/lib/types";
import React from "react";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="mt-12 h-96 rounded-xl bg-gray-200" />
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="rounded-lg bg-red-50 p-6">
      <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
      <p className="mt-2 text-red-700">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
      >
        Try Again
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<CovidStat[]>({
    queryKey: ["covidStats"],
    queryFn: async () => {
      const response = await fetch("/api/covid");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = (await response.json()) as CovidStat[];
      return json;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <ErrorState
            error={error instanceof Error ? error : new Error("Unknown error")}
          />
        </div>
      </div>
    );
  }

  const covidTotals = data?.reduce(
    (acc, curr) => ({
      confirmed: acc.confirmed + curr.totalCases,
      deaths: acc.deaths + curr.totalDeaths,
      newCases: acc.newCases + (curr.newCases7DayAvg || 0),
      newDeaths: acc.newDeaths + (curr.newDeaths7DayAvg || 0),
    }),
    { confirmed: 0, deaths: 0, newCases: 0, newDeaths: 0 },
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <header className="mb-12">
          <h1 className="text-center text-5xl font-bold text-gray-900">
            COVID&rsquo;19 Daily Overview
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            Stay updated with the latest COVID‑19 statistics and travel risk
            advisories
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-semibold text-gray-800">
            Global Summary
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-lg font-semibold text-blue-600">
                Confirmed Cases
              </h3>
              <p className="mt-3 text-4xl font-bold text-blue-700">
                {covidTotals?.confirmed.toLocaleString()}
              </p>
            </div>
            <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-lg font-semibold text-red-500">Deaths</h3>
              <p className="mt-3 text-4xl font-bold text-red-600">
                {covidTotals?.deaths.toLocaleString()}
              </p>
            </div>
            <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-lg font-semibold text-green-500">
                New Cases
              </h3>
              <p className="mt-3 text-4xl font-bold text-green-600">
                {covidTotals?.newCases.toLocaleString()}
              </p>
            </div>
            <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-lg font-semibold text-yellow-500">
                New Deaths
              </h3>
              <p className="mt-3 text-4xl font-bold text-yellow-600">
                {covidTotals?.newDeaths.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-semibold text-gray-800">
            Country Statistics
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Country",
                    "Region",
                    "Total Cases",
                    "Total Deaths",
                    "New Cases (7-day avg)",
                    "New Deaths (7-day avg)",
                    "Last Updated",
                  ].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {stat.countryName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {stat.whoRegion}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-blue-600">
                      {stat.totalCases.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-red-600">
                      {stat.totalDeaths.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-green-600">
                      {stat.newCases7DayAvg?.toLocaleString() || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-yellow-600">
                      {stat.newDeaths7DayAvg?.toLocaleString() || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {stat.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-3xl font-semibold text-gray-800">
            Important Information
          </h2>
          <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 shadow-md">
            <p className="text-lg text-blue-800">
              Based on today&apos;s statistics, travel to high-infection regions
              is discouraged unless absolutely necessary. Please follow all
              local guidelines and take necessary precautions including:
            </p>
            <ul className="ml-6 mt-4 list-disc text-blue-700">
              <li>Wearing appropriate face masks</li>
              <li>Maintaining regular hand hygiene</li>
              <li>Practicing social distancing</li>
              <li>Following local health guidelines</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
