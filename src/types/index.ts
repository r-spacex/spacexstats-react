import { SectionId } from 'redux/navigation';
import {
  RSXAPICore,
  RSXAPIRocket,
  RSXAPIPayload,
  RSXAPILaunchpad,
  RSXAPILandpad,
  RSXAPICrew,
  RSXAPIStarlink,
  RSXAPICompany,
  RSXAPIRoadster,
  RSXAPIRocketType,
  RSXAPILaunchpadType,
  RSXAPILaunchCore,
  RSXAPICoreStatus,
  RSXAPILaunch,
  RSXAPILandpadType,
  RSXAPILaunchDatePrecision,
  RSXAPILandingType,
  RSXAPIOrbit,
} from '../api/r-spacex/types';

export type {
  RSXAPILaunch as Launch,
  RSXAPICore as Core,
  RSXAPIRocket as Rocket,
  RSXAPIPayload as Payload,
  RSXAPILaunchpad as Launchpad,
  RSXAPILandpad as Landpad,
  RSXAPICrew as Crew,
  RSXAPIStarlink as Starlink,
  RSXAPICompany as Company,
  RSXAPIRoadster as Roadster,
  RSXAPILaunchCore as LaunchCore,
};

export {
  RSXAPILaunchDatePrecision as LaunchDatePrecision,
  RSXAPILandpadType as LandpadType,
  RSXAPILaunchpadType as LaunchpadType,
  RSXAPIOrbit as Orbit,
  RSXAPIRocketType as RocketType,
  RSXAPILandingType as LandingType,
  RSXAPICoreStatus as CoreStatus,
};

export interface SpaceXStatsData {
  buildDate: string;
  pastLaunches: RSXAPILaunch[];
  upcomingLaunches: RSXAPILaunch[];
  cores: RSXAPICore[];
  rockets: RSXAPIRocket[];
  payloads: RSXAPIPayload[];
  launchpads: RSXAPILaunchpad[];
  landpads: RSXAPILandpad[];
  crew: RSXAPICrew[];
  starlink: RSXAPIStarlink[];
  company: RSXAPICompany;
  roadster: RSXAPIRoadster;
}

export interface BlockProps {
  data: SpaceXStatsData;
  id: SectionId;
  up?: SectionId;
  down?: SectionId;
}
