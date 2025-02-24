export interface CovidStat {
  id: string;
  countryCode: string;
  countryName: string;
  whoRegion: string;
  totalCases: number;
  totalDeaths: number;
  newCases7DayAvg: number;
  newDeaths7DayAvg: number;
  lastUpdated: string;
}
