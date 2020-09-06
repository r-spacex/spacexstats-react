import { SectionId } from 'redux/navigation';

export enum RocketType {
  f1 = '5e9d0d95eda69955f709d1eb',
  f9 = '5e9d0d95eda69973a809d1ec',
  fh = '5e9d0d95eda69974db09d1ed',
  starship = '5e9d0d96eda699382d09d1ee',
}

export interface Rocket {
  id: RocketType;
  name: string;
}

export enum LaunchpadType {
  kwajalein = '5e9e4502f5090995de566f86',
  slc40 = '5e9e4501f509094ba4566f84',
  vafb = '5e9e4502f509092b78566f87',
  lc39a = '5e9e4502f509094188566f88',
}

export interface Launchpad {
  id: LaunchpadType;
  name: string;
}

export enum LandpadType {
  lz1 = '5e9e3032383ecb267a34e7c7',
  lz2 = '5e9e3032383ecb90a834e7c8',
  lz4 = '5e9e3032383ecb554034e7c9',
  jrtiv1 = '5e9e3032383ecb761634e7cb',
  jrti = '5e9e3033383ecbb9e534e7cc',
  ocisly = '5e9e3032383ecb6bb234e7ca',
  asog = '5e9e3033383ecb075134e7cd',
}

export interface Landpad {
  id: LandpadType;
  name: string;
}
export enum LaunchDatePrecision {
  year = 'year',
  half = 'half',
  quarter = 'quarter',
  month = 'month',
  day = 'day',
  hour = 'hour',
}

export enum LandingType {
  ocean = 'Ocean',
  asds = 'ASDS',
  rtls = 'RTLS',
}

export enum Orbit {
  esl1 = 'ES-L1',
  hco = 'HCO',
  heo = 'HEO',
  gto = 'GTO',
  iss = 'ISS',
  leo = 'LEO',
  meo = 'MEO',
  po = 'PO',
  sso = 'SSO',
  vleo = 'VLEO',
  // Unorminal
  suborbital = 'so',
}

export interface Payload {
  id: string;
  name: string;
  type: string;
  norad_ids: number[];
  reused: boolean;
  customers: string[];
  mass_kg: number | null;
  orbit: Orbit;
  dragon: {
    mass_returned_kg: number | null;
    flight_time_sec: number | null;
  };
}

export interface LaunchFairings {
  recovery_attempt: boolean;
  recovered: boolean | null;
  reused: boolean;
}

export interface LaunchCore {
  core: string;
  flight: number;
  landing_success: boolean;
  landing_attempt: boolean;
  landing_type: LandingType;
  landpad: LandpadType;
  reused: boolean;
}

export enum CrewStatus {
  active = 'active',
  inactive = 'inactive',
  retired = 'retired',
  unknown = 'unknown',
}

export interface Crew {
  id: string;
  name: string;
  agency: string | null;
  launches: string[];
  status: CrewStatus;
}

export interface Launch {
  id: string;
  flight_number: number;
  name: string;
  date_unix: number;
  date_utc: string;
  date_precision: LaunchDatePrecision;
  rocket: RocketType;
  payloads: string[];
  launchpad: LaunchpadType;
  success: boolean;
  details: string | null;
  upcoming: boolean;
  cores: LaunchCore[];
  fairings: LaunchFairings;
  crew: string[];
}

export enum CoreStatus {
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
  unknown = 'unknown',
  expended = 'expended',
  retired = 'retired',
}

export interface Core {
  id: string;
  serial: string;
  status: CoreStatus;
  launches: string[];
  reuse_count: number;
}

export interface Starlink {
  id: string;
  launch: string;
  version: string;
  spaceTrack: {
    OBJECT_NAME: string;
    LAUNCH_DATE: string;
    DECAY_DATE: string | null;
    DECAYED: 1 | 0;
  };
}

export interface Company {
  id: string;
  employees: number;
}

export interface Roadster {
  id: string;
  earth_distance_km: number;
  speed_kph: number;
  details: string;
}

export interface SpaceXData {
  pastLaunches: Launch[];
  upcomingLaunches: Launch[];
  cores: Core[];
  rockets: Rocket[];
  payloads: Payload[];
  launchpads: Launchpad[];
  landpads: Landpad[];
  crew: Crew[];
  starlink: Starlink[];
  company: Company;
  roadster: Roadster;
}

export interface BlockProps {
  data: SpaceXData;
  id: SectionId;
  up?: SectionId;
  down?: SectionId;
}
