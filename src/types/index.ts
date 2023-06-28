import { SectionId } from 'redux/navigation';
import {
  RSXAPICrew,
  RSXAPIStarlink,
  RSXAPICompany,
  RSXAPIRoadster,
} from '../data/r-spacex/types';

export enum Rocket {
  f1 = 'Falcon 1',
  f9 = 'Falcon 9',
  fh = 'Falcon Heavy',
  starship = 'Starship',
}

export enum Launchpad {
  kwajalein = 'Kwajalein Atoll',
  slc40 = 'Cape Canaveral SLC 40',
  vafb = 'Vanderberg AFB SLC 4E',
  lc39a = 'KSC Historic LC 39A',
  starbase = 'Boca Chica Launch Mount A',
  unknown = 'Unknown',
}

export enum Landpad {
  ocean = 'Ocean',
  lz1 = 'Landing Zone 1',
  lz2 = 'Landing Zone 2',
  lz4 = 'Landing Zone 4',
  jrtiv1 = 'Just Read The Instructions (old)',
  jrti = 'Just Read The Instructions',
  ocisly = 'Of Course I Still Love You',
  asog = 'A Shortfall Of Gravitas',
}

export const isLandpadRTLS = (landing: Landpad | null): boolean => {
  switch (landing) {
    case Landpad.lz1:
    case Landpad.lz2:
    case Landpad.lz4:
      return true;
    default:
      return false;
  }
};

export const isLandpadASDS = (landing: Landpad | null): boolean => {
  switch (landing) {
    case Landpad.ocisly:
    case Landpad.jrti:
    case Landpad.jrtiv1:
    case Landpad.asog:
      return true;
    default:
      return false;
  }
};

export enum LaunchDatePrecision {
  year = 'year',
  half = 'half',
  quarter = 'quarter',
  month = 'month',
  day = 'day',
  hour = 'hour',
}

export enum Orbit {
  cislunar = 'cislunar',
  interplanetary = 'interplanetary',
  gto = 'gto',
  leo = 'leo',
  iss = 'iss',
  meo = 'meo',
  po = 'po',
  sso = 'sso',
  // Unorminal
  suborbital = 'suborbital',
}
export enum CrewStatus {
  active = 'active',
  inactive = 'inactive',
  retired = 'retired',
  unknown = 'unknown',
}

export enum CoreStatus {
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
  unknown = 'unknown',
  expended = 'expended',
  retired = 'retired',
}

export interface CoreLaunch {
  core: string;
  flight: number;
  landingSuccess: boolean;
  landing: Landpad | null;
  reused: boolean;
}

export interface FairingsLaunch {
  recoveryAttempt: boolean;
  recovered: boolean | null;
  reused: boolean;
}

export interface Launch {
  id: string;
  name: string;
  date: Date;
  datePrecision: LaunchDatePrecision;
  rocket: Rocket;
  payloads: Payload[];
  launchpad: Launchpad;
  success: boolean;
  details: string | null;
  upcoming: boolean;
  cores: CoreLaunch[];
  fairings: FairingsLaunch | null;
  crew: string[];
}

export interface Core {
  id: string;
  serial: string;
  status: CoreStatus;
  launches: string[];
  reuseCount: number;
}

export interface Payload {
  id: string;
  name: string;
  type: string;
  noradIds: number[];
  reused: boolean;
  customers: string[];
  mass: number | null;
  orbit: Orbit | null;
  dragon: {
    massReturned: number | null;
    flightTime: number | null;
  };
}

export type {
  RSXAPICrew as Crew,
  RSXAPIStarlink as Starlink,
  RSXAPICompany as Company,
  RSXAPIRoadster as Roadster,
};

export interface SpaceXStatsData {
  buildDate: string;
  pastLaunches: Launch[];
  upcomingLaunches: Launch[];
  // cores: Core[];
  // crew: RSXAPICrew[];
  // starlink: RSXAPIStarlink[];
  // company: RSXAPICompany;
  // roadster: RSXAPIRoadster;
}

export interface BlockProps {
  data: SpaceXStatsData;
  id: SectionId;
  up?: SectionId;
  down?: SectionId;
}
