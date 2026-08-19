export const APP_CONFIG = {
  name: "RailTrack AI",
  description: "SIH25022 Railway Traffic Management Platform",
  version: "1.0.0",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  isDemoMode: true,
};

export const RAILWAY_ZONES = [
  { id: "CR", name: "Central Railway", hq: "Mumbai CSMT" },
  { id: "ER", name: "Eastern Railway", hq: "Kolkata" },
  { id: "NR", name: "Northern Railway", hq: "New Delhi" },
  { id: "SR", name: "Southern Railway", hq: "Chennai Central" },
  { id: "WR", name: "Western Railway", hq: "Mumbai Churchgate" },
  { id: "SCR", name: "South Central Railway", hq: "Secunderabad" },
  { id: "SER", name: "South Eastern Railway", hq: "Kolkata" },
  { id: "SWR", name: "South Western Railway", hq: "Hubballi" },
  { id: "WCR", name: "West Central Railway", hq: "Jabalpur" },
  { id: "ECR", name: "East Central Railway", hq: "Hajipur" },
  { id: "ECoR", name: "East Coast Railway", hq: "Bhubaneswar" },
  { id: "NCR", name: "North Central Railway", hq: "Prayagraj" },
  { id: "NER", name: "North Eastern Railway", hq: "Gorakhpur" },
  { id: "NFR", name: "Northeast Frontier Railway", hq: "Maligaon, Guwahati" },
  { id: "NWR", name: "North Western Railway", hq: "Jaipur" },
  { id: "SECR", name: "South East Central Railway", hq: "Bilaspur" },
  { id: "KR", name: "Konkan Railway", hq: "Navi Mumbai" },
];

export const ALERT_SEVERITIES = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success",
};

export const TRAIN_TYPES = {
  VANDE_BHARAT: "Vande Bharat Express",
  RAJDHANI: "Rajdhani Express",
  SHATABDI: "Shatabdi Express",
  DURONTO: "Duronto Express",
  SUPERFAST: "Superfast Express",
  EXPRESS: "Mail/Express",
  PASSENGER: "Passenger",
  FREIGHT: "Freight",
};
