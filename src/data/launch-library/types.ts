import { BuildInfoData } from 'data/common';

export interface LLAPIData extends BuildInfoData {
  spacexdatalaunches: { launches: LLAPILaunch[] };
}

export enum LLAPILaunchStatus {
  success = 3,
  failure = 4,
}

export enum LLAPIRocketType {
  f1 = 133,
  f9v11 = 14,
  f9ft = 55,
  f9b4 = 145,
  f9b5 = 164,
  fh = 161,
  starshipproto = 207,
  starship = 464,
}

export enum LLAPILaunchpadType {
  kwajalein = 107,
  slc40 = 80,
  vafb = 16,
  lc39a = 87,
  lc39aStarshipPad = 203,
  starbase = 188,
  starbasetestpadA = 111,
  starbasetestpadB = 187,
  unknown1 = 54,
  unknown2 = 72,
}

export enum LLAPILandpadType {
  lz1 = '5e9e3032383ecb267a34e7c7',
  lz2 = '5e9e3032383ecb90a834e7c8',
  lz4 = '5e9e3032383ecb554034e7c9',
  jrtiv1 = '5e9e3032383ecb761634e7cb',
  jrti = '5e9e3033383ecbb9e534e7cc',
  ocisly = '5e9e3032383ecb6bb234e7ca',
  asog = '5e9e3033383ecb075134e7cd',
}

export enum RSXAPILandingType {
  ocean = 'Ocean',
  asds = 'ASDS',
  rtls = 'RTLS',
}

export enum LLAPIOrbit {
  esl1 = 'ES-L1',
  hco = 'HCO',
  heo = 'HEO',
  beo = 'BEO',
  gto = 'GTO',
  geo = 'GEO',
  tli = 'TLI',
  iss = 'ISS',
  leo = 'LEO',
  meo = 'MEO',
  po = 'PO',
  sso = 17,
  vleo = 'VLEO',
  // Unorminal
  suborbital = 'SO',
}
export enum RSXAPICrewStatus {
  active = 'active',
  inactive = 'inactive',
  retired = 'retired',
  unknown = 'unknown',
}

export enum RSXAPICoreStatus {
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
  unknown = 'unknown',
  expended = 'expended',
  retired = 'retired',
}

export interface LLAPIRocket {
  configuration: {
    id: number;
    name: string;
  };
}

export interface LLAPILaunchpad {
  id: LLAPILaunchpadType;
  name: string;
}

export interface LLAPIMission {
  description: string;
  orbit: {
    id: LLAPIOrbit;
  };
}

export interface LLAPILaunch {
  id: string;
  name: string;
  net: string;
  rocket: LLAPIRocket;
  mission: LLAPIMission | null;
  status: {
    id: LLAPILaunchStatus;
  };
  pad: LLAPILaunchpad;
  failreason: string;
}
