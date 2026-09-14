export interface AnalyticsOverview {
  totalResponses: number;
  transportModes: Record<string, number>;
  rideDifficulty: Record<string, number>;
  commonProblems: Record<string, number>;
  waitingTimes: Record<string, number>;
  urgentTransport: Record<string, number>;
  vehicleGoingSameDirection: Record<string, number>;
  isaharaUsefulness: Record<string, number>;
  trustFactors: Record<string, number>;
  rideSignalInterest: Record<string, number>;
  biggestProblem: Record<string, number>;
  isaharaAdoption: Record<string, number>;
  pilotInterest: Record<string, number>;
}

export interface AnalyticsFilterQuery {
  college?: string;
  yearOfStudy?: string;
  startDate?: string;
  endDate?: string;
  from?: string;
  to?: string;
}
