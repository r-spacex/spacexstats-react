import { BuildInfoData } from 'api/common';

export interface RSXAPIData extends BuildInfoData {
  spacexdatalaunches: { launches: RSXAPILaunch[] };
  spacexdatacores: { cores: RSXAPICore[] };
  spacexdatarockets: { rockets: RSXAPIRocket[] };
  spacexdatapayloads: { payloads: RSXAPIPayload[] };
  spacexdatalaunchpads: { launchpads: RSXAPILaunchpad[] };
  spacexdatalandpads: { landpads: RSXAPILandpad[] };
  spacexdatacrew: { crew: RSXAPICrew[] };
  spacexdatastarlink: { starlink: RSXAPIStarlink[] };
  spacexdatacompany: { company: RSXAPICompany };
  spacexdataroadster: { roadster: RSXAPIRoadster };
}

export enum RSXAPIRocketType {
  f1 = '5e9d0d95eda69955f709d1eb',
  f9 = '5e9d0d95eda69973a809d1ec',
  fh = '5e9d0d95eda69974db09d1ed',
  starship = '5e9d0d96eda699382d09d1ee',
}

export interface RSXAPIRocket {
  id: RSXAPIRocketType;
  name: string;
}

export enum RSXAPILaunchpadType {
  kwajalein = '5e9e4502f5090995de566f86',
  slc40 = '5e9e4501f509094ba4566f84',
  vafb = '5e9e4502f509092b78566f87',
  lc39a = '5e9e4502f509094188566f88',
}

export interface RSXAPILaunchpad {
  id: RSXAPILaunchpadType;
  name: string;
}

export enum RSXAPILandpadType {
  lz1 = '5e9e3032383ecb267a34e7c7',
  lz2 = '5e9e3032383ecb90a834e7c8',
  lz4 = '5e9e3032383ecb554034e7c9',
  jrtiv1 = '5e9e3032383ecb761634e7cb',
  jrti = '5e9e3033383ecbb9e534e7cc',
  ocisly = '5e9e3032383ecb6bb234e7ca',
  asog = '5e9e3033383ecb075134e7cd',
}

export interface RSXAPILandpad {
  id: RSXAPILandpadType;
  name: string;
}
export enum RSXAPILaunchDatePrecision {
  year = 'year',
  half = 'half',
  quarter = 'quarter',
  month = 'month',
  day = 'day',
  hour = 'hour',
}

export enum RSXAPILandingType {
  ocean = 'Ocean',
  asds = 'ASDS',
  rtls = 'RTLS',
}

export enum RSXAPIOrbit {
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

export interface RSXAPIPayload {
  id: string;
  name: string;
  type: string;
  norad_ids: number[];
  reused: boolean;
  customers: string[];
  mass_kg: number | null;
  orbit: RSXAPIOrbit;
  dragon: {
    mass_returned_kg: number | null;
    flight_time_sec: number | null;
  };
}

export interface RSXAPILaunchFairings {
  recovery_attempt: boolean;
  recovered: boolean | null;
  reused: boolean;
}

export interface RSXAPILaunchCore {
  core: string;
  flight: number;
  landing_success: boolean;
  landing_attempt: boolean;
  landing_type: RSXAPILandingType;
  landpad: RSXAPILandpadType;
  reused: boolean;
}

export enum RSXAPICrewStatus {
  active = 'active',
  inactive = 'inactive',
  retired = 'retired',
  unknown = 'unknown',
}

export interface RSXAPICrew {
  id: string;
  name: string;
  agency: string | null;
  launches: string[];
  status: RSXAPICrewStatus;
}

export interface RSXAPILaunch {
  id: string;
  name: string;
  date_unix: number;
  date_utc: string;
  date_precision: RSXAPILaunchDatePrecision;
  rocket: RSXAPIRocketType;
  payloads: string[];
  launchpad: RSXAPILaunchpadType;
  success: boolean;
  details: string | null;
  upcoming: boolean;
  cores: RSXAPILaunchCore[];
  fairings: RSXAPILaunchFairings;
  crew: string[];
}

export enum RSXAPICoreStatus {
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
  unknown = 'unknown',
  expended = 'expended',
  retired = 'retired',
}

export interface RSXAPICore {
  id: string;
  serial: string;
  status: RSXAPICoreStatus;
  launches: string[];
  reuse_count: number;
}

export interface RSXAPIStarlink {
  id: string;
  launch: string;
  version: string;
  spaceTrack: {
    OBJECT_NAME: string;
    LAUNCH_DATE: string;
    DECAY_DATE: string | null;
  };
}

export interface RSXAPICompany {
  id: string;
  employees: number;
}

export interface RSXAPIRoadster {
  id: string;
  earth_distance_km: number;
  speed_kph: number;
  details: string;
}
