export enum RocketType {
  f1 = 'falcon1',
  f9 = 'falcon9',
  fh = 'falconheavy',
}

export enum LaunchDatePrecision {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}

export enum LandingType {
  asds = 'ASDS',
  rtls = 'RTLS',
}

export enum LandingVehicle {
  jrti = 'JRTI',
  ocisly = 'OCISLY',
  lz1 = 'LZ-1',
  lz2 = 'LZ-2',
}

export enum Orbit {
  hco = 'HCO',
  heo = 'HEO',
  gto = 'GTO',
  iss = 'ISS',
  leo = 'LEO',
  meo = 'MEO',
  po = 'PO',
  sso = 'SSO',
  vleo = 'VLEO',
}

export interface Payload {
  payload_id: string;
  norad_id: number[];
  reused: boolean;
  customers: string[];
  nationality: string;
  payload_type: string;
  payload_mass_kg: number;
  orbit: Orbit;
  mass_returned_kg: number;
  flight_time_sec: number;
}

export interface LaunchFairings {
  recovery_attempt: boolean;
  recovered: boolean;
  reused: boolean;
  ship: string;
}

export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_date_unix: number;
  launch_date_utc: string;
  tentative_max_precision: LaunchDatePrecision;
  rocket: {
    rocket_id: RocketType;
    rocket_name: string;
    first_stage: {
      cores: [
        {
          core_serial: string;
          flight: number;
          land_success: boolean;
          landing_intent: boolean;
          landing_type: LaunchDatePrecision;
          landing_vehicle: LandingVehicle;
          reused: boolean;
        },
      ];
    };
    second_stage: {
      payloads: Payload[];
    };
    fairings: LaunchFairings | null;
  };
  launch_site: {
    site_id: string;
    site_name: string;
  };
  launch_success: boolean;
  details: string;
  upcoming: boolean;
  crew: null;
}

export enum CoreStatus {
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
  unknown = 'unknown',
}

export interface Core {
  core_serial: string;
  status: CoreStatus;
  missions: [
    {
      name: string;
      flight: number;
    },
  ];
  reuse_count: number;
  details: string;
}

export interface SpaceXAPIData {
  launches: Launch[];
  cores: Core[];
}

export interface SpaceXData {
  pastLaunches: Launch[];
  upcomingLaunches: Launch[];
  cores: Core[];
}
