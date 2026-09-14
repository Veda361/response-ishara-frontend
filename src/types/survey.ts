export const USUAL_TRAVEL_MODES = [
  "college_bus",
  "auto",
  "e_rickshaw",
  "cab",
  "bike",
  "scooty",
  "car",
  "walking",
  "pickup",
  "other",
] as const;
export type UsualTravelMode = (typeof USUAL_TRAVEL_MODES)[number];

export const DIFFICULTY_FINDING_RIDES = [
  "often",
  "sometimes",
  "rarely",
  "never",
] as const;
export type DifficultyFindingRide = (typeof DIFFICULTY_FINDING_RIDES)[number];

export const PROBLEMS_FACED = [
  "no_vehicle",
  "long_wait",
  "cannot_find_vehicle_same_direction",
  "expensive",
  "safety",
  "urgent_need",
  "other",
] as const;
export type ProblemFaced = (typeof PROBLEMS_FACED)[number];

export const LONGEST_WAITS = [
  "under_5",
  "5_10",
  "10_20",
  "20_30",
  "over_30",
] as const;
export type LongestWait = (typeof LONGEST_WAITS)[number];

export const NEEDED_URGENT_TRANSPORTS = [
  "yes_several_times",
  "yes_once",
  "no",
  "dont_remember",
] as const;
export type NeededUrgentTransport = (typeof NEEDED_URGENT_TRANSPORTS)[number];

export const SEEN_VEHICLE_GOING_MY_WAYS = [
  "many_times",
  "sometimes",
  "rarely",
  "never",
] as const;
export type SeenVehicleGoingMyWay = (typeof SEEN_VEHICLE_GOING_MY_WAYS)[number];

export const NEARBY_VERIFIED_VEHICLE_USEFULS = [
  "very_useful",
  "useful",
  "maybe",
  "not_useful",
] as const;
export type NearbyVerifiedVehicleUseful = (typeof NEARBY_VERIFIED_VEHICLE_USEFULS)[number];

export const TRUST_FACTORS = [
  "driver_verified",
  "vehicle_number",
  "driver_details",
  "share_with_friend",
  "used_by_other_students",
  "would_not_trust_unknown_vehicle",
  "other",
] as const;
export type TrustFactor = (typeof TRUST_FACTORS)[number];

export const WOULD_USE_RIDE_SIGNALS = [
  "definitely",
  "probably",
  "maybe",
  "probably_not",
  "never",
] as const;
export type WouldUseRideSignal = (typeof WOULD_USE_RIDE_SIGNALS)[number];

export const BIGGEST_PROBLEMS = [
  "long_wait",
  "no_vehicle",
  "finding_same_direction_vehicle",
  "cost",
  "safety",
  "emergency",
  "no_major_problem",
  "other",
] as const;
export type BiggestProblem = (typeof BIGGEST_PROBLEMS)[number];

export const WOULD_TRY_ISAHARAS = [
  "definitely",
  "probably",
  "maybe",
  "probably_not",
  "definitely_not",
] as const;
export type WouldTryIsahara = (typeof WOULD_TRY_ISAHARAS)[number];

export interface StudentInfo {
  name?: string;
  college: string;
  yearOfStudy?: string;
  contact?: string;
  interestedInPilot: boolean;
}

export interface TravelInfo {
  usualTravelMode: UsualTravelMode;
  difficultyFindingRide: DifficultyFindingRide;
  problemsFaced: ProblemFaced[];
  longestWait: LongestWait;
}

export interface CreateSurveyInput {
  student: StudentInfo;
  travel: TravelInfo;
  neededUrgentTransport: NeededUrgentTransport;
  seenVehicleGoingMyWay: SeenVehicleGoingMyWay;
  nearbyVerifiedVehicleUseful: NearbyVerifiedVehicleUseful;
  trustFactors: TrustFactor[];
  wouldUseRideSignal: WouldUseRideSignal;
  biggestProblem: BiggestProblem;
  wouldTryIsahara: WouldTryIsahara;
  improvementSuggestion?: string;
}

export interface ISurveyResponse {
  _id: string;
  student: StudentInfo;
  travel: TravelInfo;
  neededUrgentTransport: NeededUrgentTransport;
  seenVehicleGoingMyWay: SeenVehicleGoingMyWay;
  nearbyVerifiedVehicleUseful: NearbyVerifiedVehicleUseful;
  trustFactors: TrustFactor[];
  wouldUseRideSignal: WouldUseRideSignal;
  biggestProblem: BiggestProblem;
  wouldTryIsahara: WouldTryIsahara;
  improvementSuggestion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyListQuery {
  page?: number;
  limit?: number;
  college?: string;
  wouldTryIsahara?: string;
  interestedInPilot?: boolean | string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
