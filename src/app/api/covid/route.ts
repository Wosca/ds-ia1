import { db } from "@/server/db";
import { covid_daily_stats, covid_countries } from "@/server/db/schema";
import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await db
      .select({
        id: covid_daily_stats.id,
        countryCode: covid_daily_stats.country_code,
        countryName: covid_countries.country_name,
        whoRegion: covid_countries.whoregion,
        totalCases: covid_daily_stats.total_cases,
        totalDeaths: covid_daily_stats.total_deaths,
        newCases7DayAvg: covid_daily_stats.new_cases_7day_avg,
        newDeaths7DayAvg: covid_daily_stats.new_deaths_7day_avg,
        lastUpdated: covid_daily_stats.last_updated,
      })
      .from(covid_daily_stats)
      .leftJoin(
        covid_countries,
        sql`${covid_daily_stats.country_code} = ${covid_countries.country_code}`,
      )
      .orderBy(desc(covid_daily_stats.total_cases))
      .limit(50); // Only get top 50 countries by default

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching COVID stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
