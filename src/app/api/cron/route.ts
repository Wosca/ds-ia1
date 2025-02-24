import { db } from "@/server/db";
import { NextResponse, NextRequest } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest, res: NextResponse) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await db.execute(sql`
    WITH MovingAverages AS (
      SELECT 
        country_code,
        date_reported,
        cumulative_cases,
        cumulative_deaths,
        AVG(new_cases) OVER (
          PARTITION BY country_code 
          ORDER BY date_reported DESC
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as new_cases_7day_avg,
        AVG(new_deaths) OVER (
          PARTITION BY country_code 
          ORDER BY date_reported DESC
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as new_deaths_7day_avg
      FROM covid_cases
    )
    INSERT INTO covid_daily_stats (
      id,
      country_code,
      last_updated,
      total_cases,
      total_deaths,
      new_cases_7day_avg,
      new_deaths_7day_avg
    )
    SELECT 
      gen_random_uuid()::text as id,
      country_code,
      MAX(date_reported) as last_updated,
      MAX(cumulative_cases) as total_cases,
      MAX(cumulative_deaths) as total_deaths,
      AVG(new_cases_7day_avg) as new_cases_7day_avg,
      AVG(new_deaths_7day_avg) as new_deaths_7day_avg
    FROM MovingAverages
    GROUP BY country_code
    ON CONFLICT (country_code) DO UPDATE
    SET 
      last_updated = EXCLUDED.last_updated,
      total_cases = EXCLUDED.total_cases,
      total_deaths = EXCLUDED.total_deaths,
      new_cases_7day_avg = EXCLUDED.new_cases_7day_avg,
      new_deaths_7day_avg = EXCLUDED.new_deaths_7day_avg;
  `);
  return NextResponse.json({ ok: true });
}
