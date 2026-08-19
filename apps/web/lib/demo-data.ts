// ============================================================
// DEMO DATA — Real-Time Data Abstraction Layer
// Demo Provider Adapter: Historical replay dataset
// Implements ITrainDataProvider for demonstration mode.
// Connect NTESAdapter or CRISAdapter with Ministry API
// credentials to switch to live operational data.
// ============================================================

export const DEMO_STATIONS = [
  { id: 's1', code: 'NDLS', name: 'New Delhi', nameHindi: 'नई दिल्ली', latitude: 28.6428, longitude: 77.2197, zone: 'NR', division: 'Delhi', category: 'A1', state: 'Delhi', city: 'New Delhi', isJunction: true, hasWifi: true, totalPlatforms: 16 },
  { id: 's2', code: 'CSMT', name: 'Mumbai CSMT', nameHindi: 'मुंबई छत्रपति शिवाजी महाराज टर्मिनस', latitude: 18.9398, longitude: 72.8355, zone: 'CR', division: 'Mumbai', category: 'A1', state: 'Maharashtra', city: 'Mumbai', isJunction: true, hasWifi: true, totalPlatforms: 18 },
  { id: 's3', code: 'MAS', name: 'Chennai Central', nameHindi: 'चेन्नई सेंट्रल', latitude: 13.0827, longitude: 80.2750, zone: 'SR', division: 'Chennai', category: 'A1', state: 'Tamil Nadu', city: 'Chennai', isJunction: true, hasWifi: true, totalPlatforms: 12 },
  { id: 's4', code: 'HWH', name: 'Howrah Junction', nameHindi: 'हावड़ा जंक्शन', latitude: 22.5839, longitude: 88.3423, zone: 'ER', division: 'Howrah', category: 'A1', state: 'West Bengal', city: 'Kolkata', isJunction: true, hasWifi: true, totalPlatforms: 23 },
  { id: 's5', code: 'SBC', name: 'Bengaluru City', nameHindi: 'बेंगलुरु सिटी', latitude: 12.9784, longitude: 77.5680, zone: 'SWR', division: 'Bengaluru', category: 'A1', state: 'Karnataka', city: 'Bengaluru', isJunction: true, hasWifi: true, totalPlatforms: 10 },
  { id: 's6', code: 'SC', name: 'Secunderabad Junction', nameHindi: 'सिकंदराबाद जंक्शन', latitude: 17.4339, longitude: 78.5018, zone: 'SCR', division: 'Secunderabad', category: 'A1', state: 'Telangana', city: 'Hyderabad', isJunction: true, hasWifi: true, totalPlatforms: 10 },
  { id: 's7', code: 'ADI', name: 'Ahmedabad Junction', nameHindi: 'अहमदाबाद जंक्शन', latitude: 23.0258, longitude: 72.5974, zone: 'WR', division: 'Ahmedabad', category: 'A', state: 'Gujarat', city: 'Ahmedabad', isJunction: true, hasWifi: true, totalPlatforms: 12 },
  { id: 's8', code: 'PUNE', name: 'Pune Junction', nameHindi: 'पुणे जंक्शन', latitude: 18.5289, longitude: 73.8741, zone: 'CR', division: 'Pune', category: 'A', state: 'Maharashtra', city: 'Pune', isJunction: true, hasWifi: true, totalPlatforms: 6 },
  { id: 's9', code: 'JP', name: 'Jaipur Junction', nameHindi: 'जयपुर जंक्शन', latitude: 26.9124, longitude: 75.7873, zone: 'NWR', division: 'Jaipur', category: 'A', state: 'Rajasthan', city: 'Jaipur', isJunction: true, hasWifi: true, totalPlatforms: 6 },
  { id: 's10', code: 'LKO', name: 'Lucknow Charbagh', nameHindi: 'लखनऊ चारबाग', latitude: 26.8467, longitude: 80.9462, zone: 'NR', division: 'Lucknow', category: 'A', state: 'Uttar Pradesh', city: 'Lucknow', isJunction: true, hasWifi: true, totalPlatforms: 8 },
  { id: 's11', code: 'PNBE', name: 'Patna Junction', nameHindi: 'पटना जंक्शन', latitude: 25.5941, longitude: 85.1376, zone: 'ECR', division: 'Patna', category: 'A', state: 'Bihar', city: 'Patna', isJunction: true, hasWifi: true, totalPlatforms: 10 },
  { id: 's12', code: 'BPL', name: 'Bhopal Junction', nameHindi: 'भोपाल जंक्शन', latitude: 23.2599, longitude: 77.4126, zone: 'WCR', division: 'Bhopal', category: 'A', state: 'Madhya Pradesh', city: 'Bhopal', isJunction: true, hasWifi: true, totalPlatforms: 6 },
  { id: 's13', code: 'NGP', name: 'Nagpur Junction', nameHindi: 'नागपुर जंक्शन', latitude: 21.1458, longitude: 79.0882, zone: 'CR', division: 'Nagpur', category: 'A', state: 'Maharashtra', city: 'Nagpur', isJunction: true, hasWifi: true, totalPlatforms: 8 },
  { id: 's14', code: 'ST', name: 'Surat', nameHindi: 'सूरत', latitude: 21.2047, longitude: 72.8370, zone: 'WR', division: 'Mumbai', category: 'A', state: 'Gujarat', city: 'Surat', isJunction: false, hasWifi: true, totalPlatforms: 4 },
  { id: 's15', code: 'BSB', name: 'Varanasi Junction', nameHindi: 'वाराणसी जंक्शन', latitude: 25.3176, longitude: 82.9739, zone: 'NR', division: 'Varanasi', category: 'A', state: 'Uttar Pradesh', city: 'Varanasi', isJunction: true, hasWifi: true, totalPlatforms: 9 },
  { id: 's16', code: 'ASR', name: 'Amritsar Junction', nameHindi: 'अमृतसर जंक्शन', latitude: 31.6340, longitude: 74.8723, zone: 'NR', division: 'Firozpur', category: 'A', state: 'Punjab', city: 'Amritsar', isJunction: true, hasWifi: true, totalPlatforms: 7 },
  { id: 's17', code: 'ERS', name: 'Ernakulam Junction', nameHindi: 'एर्नाकुलम जंक्शन', latitude: 9.9816, longitude: 76.2999, zone: 'SR', division: 'Thiruvananthapuram', category: 'A', state: 'Kerala', city: 'Kochi', isJunction: true, hasWifi: true, totalPlatforms: 5 },
  { id: 's18', code: 'GHY', name: 'Guwahati', nameHindi: 'गुवाहाटी', latitude: 26.1445, longitude: 91.7362, zone: 'NFR', division: 'Rangiya', category: 'A', state: 'Assam', city: 'Guwahati', isJunction: true, hasWifi: true, totalPlatforms: 7 },
  { id: 's19', code: 'BBS', name: 'Bhubaneswar', nameHindi: 'भुवनेश्वर', latitude: 20.2961, longitude: 85.8245, zone: 'ECoR', division: 'Khurda Road', category: 'A', state: 'Odisha', city: 'Bhubaneswar', isJunction: false, hasWifi: true, totalPlatforms: 4 },
  { id: 's20', code: 'CDG', name: 'Chandigarh', nameHindi: 'चंडीगढ़', latitude: 30.7333, longitude: 76.7794, zone: 'NR', division: 'Ambala', category: 'A', state: 'Chandigarh', city: 'Chandigarh', isJunction: false, hasWifi: true, totalPlatforms: 6 },
];

export const DEMO_TRAINS = [
  { id: 't1', trainNumber: '12301', trainName: 'Howrah Rajdhani Express', category: 'RAJDHANI', status: 'DELAYED', origin: 'New Delhi', destination: 'Howrah Junction', originCode: 'NDLS', destinationCode: 'HWH', scheduledDeparture: '16:55', scheduledArrival: '09:55+1', delayMinutes: 47, currentStation: 'PNBE', nextStation: 'HWH', zone: 'ER', division: 'Howrah', occupancy: 420, capacity: 480 },
  { id: 't2', trainNumber: '12302', trainName: 'New Delhi Rajdhani Express', category: 'RAJDHANI', status: 'ON_TIME', origin: 'Howrah Junction', destination: 'New Delhi', originCode: 'HWH', destinationCode: 'NDLS', scheduledDeparture: '13:05', scheduledArrival: '06:00+1', delayMinutes: 0, currentStation: 'PNBE', nextStation: 'BSB', zone: 'NR', division: 'Delhi', occupancy: 390, capacity: 480 },
  { id: 't3', trainNumber: '12951', trainName: 'Mumbai Rajdhani Express', category: 'RAJDHANI', status: 'DELAYED', origin: 'Mumbai Central', destination: 'New Delhi', originCode: 'MMCT', destinationCode: 'NDLS', scheduledDeparture: '16:35', scheduledArrival: '08:35+1', delayMinutes: 23, currentStation: 'BPL', nextStation: 'NDLS', zone: 'WR', division: 'Mumbai', occupancy: 445, capacity: 480 },
  { id: 't4', trainNumber: '22439', trainName: 'New Delhi Vande Bharat Express', category: 'VANDE_BHARAT', status: 'ON_TIME', origin: 'New Delhi', destination: 'Varanasi', originCode: 'NDLS', destinationCode: 'BSB', scheduledDeparture: '06:00', scheduledArrival: '14:00', delayMinutes: 0, currentStation: 'LKO', nextStation: 'BSB', zone: 'NR', division: 'Delhi', occupancy: 760, capacity: 820 },
  { id: 't5', trainNumber: '12009', trainName: 'Shatabdi Express', category: 'SHATABDI', status: 'ON_TIME', origin: 'Mumbai Central', destination: 'Ahmedabad', originCode: 'MMCT', destinationCode: 'ADI', scheduledDeparture: '06:25', scheduledArrival: '13:10', delayMinutes: 0, currentStation: 'ST', nextStation: 'ADI', zone: 'WR', division: 'Mumbai', occupancy: 880, capacity: 1000 },
  { id: 't6', trainNumber: '12627', trainName: 'Karnataka Express', category: 'EXPRESS', status: 'RUNNING_LATE', origin: 'New Delhi', destination: 'Bengaluru City', originCode: 'NDLS', destinationCode: 'SBC', scheduledDeparture: '21:45', scheduledArrival: '07:00+2', delayMinutes: 65, currentStation: 'SC', nextStation: 'SBC', zone: 'SWR', division: 'Bengaluru', occupancy: 1100, capacity: 1300 },
  { id: 't7', trainNumber: '12431', trainName: 'Thiruvananthapuram Rajdhani', category: 'RAJDHANI', status: 'ON_TIME', origin: 'New Delhi', destination: 'Thiruvananthapuram', originCode: 'NDLS', destinationCode: 'TVC', scheduledDeparture: '11:00', scheduledArrival: '06:55+2', delayMinutes: 0, currentStation: 'ERS', nextStation: 'TVC', zone: 'SR', division: 'Thiruvananthapuram', occupancy: 360, capacity: 400 },
  { id: 't8', trainNumber: '12002', trainName: 'Bhopal Shatabdi Express', category: 'SHATABDI', status: 'ON_TIME', origin: 'New Delhi', destination: 'Habibganj', originCode: 'NDLS', destinationCode: 'HBJ', scheduledDeparture: '06:00', scheduledArrival: '13:55', delayMinutes: 0, currentStation: 'NDLS', nextStation: 'AGC', zone: 'WCR', division: 'Bhopal', occupancy: 950, capacity: 1100 },
  { id: 't9', trainNumber: '12560', trainName: 'Shiv Ganga Express', category: 'EXPRESS', status: 'DELAYED', origin: 'New Delhi', destination: 'Varanasi', originCode: 'NDLS', destinationCode: 'BSB', scheduledDeparture: '18:40', scheduledArrival: '06:05+1', delayMinutes: 38, currentStation: 'LKO', nextStation: 'BSB', zone: 'NR', division: 'Varanasi', occupancy: 1150, capacity: 1400 },
  { id: 't10', trainNumber: '15657', trainName: 'Brahmaputra Mail', category: 'MAIL', status: 'RUNNING_LATE', origin: 'Guwahati', destination: 'New Delhi', originCode: 'GHY', destinationCode: 'NDLS', scheduledDeparture: '06:50', scheduledArrival: '10:45+1', delayMinutes: 82, currentStation: 'PNBE', nextStation: 'BSB', zone: 'NFR', division: 'Rangiya', occupancy: 1300, capacity: 1600 },
  { id: 't11', trainNumber: '12621', trainName: 'Tamil Nadu Express', category: 'EXPRESS', status: 'ON_TIME', origin: 'New Delhi', destination: 'Chennai Central', originCode: 'NDLS', destinationCode: 'MAS', scheduledDeparture: '22:30', scheduledArrival: '07:10+2', delayMinutes: 0, currentStation: 'NGP', nextStation: 'MAS', zone: 'SR', division: 'Chennai', occupancy: 1200, capacity: 1400 },
  { id: 't12', trainNumber: '12957', trainName: 'Swarna Jayanti Rajdhani', category: 'RAJDHANI', status: 'ON_TIME', origin: 'Ahmedabad', destination: 'New Delhi', originCode: 'ADI', destinationCode: 'NDLS', scheduledDeparture: '19:40', scheduledArrival: '10:00+1', delayMinutes: 0, currentStation: 'JP', nextStation: 'NDLS', zone: 'WR', division: 'Ahmedabad', occupancy: 420, capacity: 480 },
  { id: 't13', trainNumber: '22221', trainName: 'Mumbai Rajdhani Express', category: 'RAJDHANI', status: 'DELAYED', origin: 'Mumbai CSMT', destination: 'Hazrat Nizamuddin', originCode: 'CSMT', destinationCode: 'NZM', scheduledDeparture: '17:00', scheduledArrival: '11:40+1', delayMinutes: 31, currentStation: 'BPL', nextStation: 'AGC', zone: 'CR', division: 'Mumbai', occupancy: 410, capacity: 480 },
  { id: 't14', trainNumber: '12285', trainName: 'Secunderabad Duronto Express', category: 'DURONTO', status: 'ON_TIME', origin: 'Hazrat Nizamuddin', destination: 'Secunderabad', originCode: 'NZM', destinationCode: 'SC', scheduledDeparture: '15:55', scheduledArrival: '11:15+1', delayMinutes: 0, currentStation: 'NGP', nextStation: 'SC', zone: 'SCR', division: 'Secunderabad', occupancy: 880, capacity: 1000 },
  { id: 't15', trainNumber: '12650', trainName: 'Karnataka Sampark Kranti', category: 'EXPRESS', status: 'DELAYED', origin: 'Hazrat Nizamuddin', destination: 'Yesvantpur', originCode: 'NZM', destinationCode: 'YPR', scheduledDeparture: '21:50', scheduledArrival: '05:55+2', delayMinutes: 55, currentStation: 'SC', nextStation: 'YPR', zone: 'SWR', division: 'Bengaluru', occupancy: 1100, capacity: 1300 },
  { id: 't16', trainNumber: '12423', trainName: 'Dibrugarh Rajdhani Express', category: 'RAJDHANI', status: 'RUNNING_LATE', origin: 'New Delhi', destination: 'Dibrugarh', originCode: 'NDLS', destinationCode: 'DBRG', scheduledDeparture: '20:00', scheduledArrival: '05:35+3', delayMinutes: 120, currentStation: 'PNBE', nextStation: 'GHY', zone: 'NFR', division: 'Rangiya', occupancy: 380, capacity: 440 },
  { id: 't17', trainNumber: '11057', trainName: 'Amritsar Express', category: 'EXPRESS', status: 'ON_TIME', origin: 'Mumbai CSMT', destination: 'Amritsar', originCode: 'CSMT', destinationCode: 'ASR', scheduledDeparture: '23:20', scheduledArrival: '11:30+2', delayMinutes: 0, currentStation: 'BPL', nextStation: 'NDLS', zone: 'NR', division: 'Firozpur', occupancy: 1300, capacity: 1600 },
  { id: 't18', trainNumber: '12138', trainName: 'Punjab Mail', category: 'MAIL', status: 'ON_TIME', origin: 'Firozpur Cantt', destination: 'Mumbai CSMT', originCode: 'FZR', destinationCode: 'CSMT', scheduledDeparture: '08:30', scheduledArrival: '21:40+1', delayMinutes: 0, currentStation: 'NDLS', nextStation: 'AGC', zone: 'CR', division: 'Mumbai', occupancy: 1400, capacity: 1700 },
  { id: 't19', trainNumber: '22119', trainName: 'Mumbai CSMT Vande Bharat', category: 'VANDE_BHARAT', status: 'ON_TIME', origin: 'Mumbai CSMT', destination: 'Solapur', originCode: 'CSMT', destinationCode: 'SUR', scheduledDeparture: '05:35', scheduledArrival: '12:45', delayMinutes: 0, currentStation: 'PUNE', nextStation: 'SUR', zone: 'CR', division: 'Pune', occupancy: 800, capacity: 820 },
  { id: 't20', trainNumber: '12245', trainName: 'Howrah Duronto Express', category: 'DURONTO', status: 'DELAYED', origin: 'Howrah', destination: 'Patna', originCode: 'HWH', destinationCode: 'PNBE', scheduledDeparture: '17:05', scheduledArrival: '22:55', delayMinutes: 28, currentStation: 'HWH', nextStation: 'PNBE', zone: 'ECR', division: 'Patna', occupancy: 900, capacity: 1000 },
];

export const DEMO_ALERTS = [
  { id: 'a1', title: 'Critical Delay: 12301 Howrah Rajdhani', description: 'Train 12301 running 47 minutes late due to fog near Mughal Sarai. Connecting train 12302 may be impacted.', severity: 'HIGH', category: 'DELAY', status: 'ACTIVE', trainNumber: '12301', stationCode: 'PNBE', aiRootCause: 'Dense fog at Mughal Sarai (BSB) reducing visibility below 100m. Signal aspects changed to caution.', recommendedAction: 'Alert connecting passengers at HWH. Consider platform reassignment.', createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'a2', title: 'Signal Failure: NDLS Platform 8', description: 'Automatic signal at New Delhi Platform 8 entry showing false indication. Engineering team notified.', severity: 'CRITICAL', category: 'INFRASTRUCTURE', status: 'ACKNOWLEDGED', stationCode: 'NDLS', aiRootCause: 'Signal relay failure detected. Likely caused by power surge during morning thunderstorm.', recommendedAction: 'Switch to absolute block working. Deploy traffic control staff at signal.', createdAt: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 'a3', title: 'Weather Alert: Thunderstorm — NCR Region', description: 'India Meteorological Department has issued orange alert for thunderstorms in NCR. 40+ trains may be affected.', severity: 'HIGH', category: 'WEATHER', status: 'ACTIVE', stationCode: 'NDLS', aiRootCause: 'Western disturbance causing intense convective activity over NCR. Wind speeds 60-70 km/h expected.', recommendedAction: 'Reduce MPS by 30% on affected sections. Alert all loco pilots.', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'a4', title: 'Mega Block: CR Main Line', description: 'Planned maintenance block on CR main line between CSMT and Kalyan from 01:00 to 05:00. 12 trains affected.', severity: 'MEDIUM', category: 'OPERATIONAL', status: 'ACTIVE', stationCode: 'CSMT', aiRootCause: 'Scheduled track tamping and rail replacement activity. Block approved by DRM Mumbai.', recommendedAction: 'Divert trains via Harbour Line. Notify passengers via SMS and station announcements.', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'a5', title: 'Cascading Delay Risk: HWH-NDLS Corridor', description: 'Current delays on the HWH-NDLS corridor may cause 8 subsequent trains to miss their slots. Immediate intervention required.', severity: 'HIGH', category: 'OPERATIONAL', status: 'ACTIVE', stationCode: 'PNBE', aiRootCause: 'Initial delay to 12301 propagating downstream due to platform conflicts at BSB and PNBE.', recommendedAction: 'Regulate 12302 at PNBE for 25 minutes to restore slot adherence. Issue precedence order.', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'a6', title: 'Overcrowding Alert: NDLS Platform 1', description: 'Passenger density at NDLS Platform 1 exceeds safe limits. 2,400 passengers awaiting delayed 12627 Karnataka Express.', severity: 'HIGH', category: 'SAFETY', status: 'ACKNOWLEDGED', stationCode: 'NDLS', aiRootCause: 'Train 12627 delay of 65 minutes causing passenger accumulation. Platform capacity: 1,800.', recommendedAction: 'Deploy RPF personnel. Open Platform 2 as overflow waiting area.', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'a7', title: 'Track Geometry Defect: Mughal Sarai Section', description: 'Track monitoring car detected geometry defect (slew >8mm) at km 780 on MGS-BSB section. Engineering inspection required.', severity: 'CRITICAL', category: 'INFRASTRUCTURE', status: 'ACTIVE', stationCode: 'BSB', aiRootCause: 'Progressive track deterioration at curve near km 780. Last tamping was 9 months ago.', recommendedAction: 'Impose 30 km/h TSR immediately. Schedule urgent track attention.', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export const DEMO_KPIS = {
  totalTrainsRunning: 213,
  onTimePercentage: 71.4,
  averageDelayMinutes: 18.3,
  totalPassengers: 2847000,
  networkHealthScore: 78.6,
  activeAlerts: 7,
  criticalAlerts: 2,
  stationsMonitored: 420,
  tracksMonitored: 1284,
  timestamp: new Date().toISOString(),
};

export const DEMO_DELAY_DISTRIBUTION = {
  onTime: 152,
  slight: 31,
  moderate: 18,
  severe: 8,
  veryLate: 4,
  cancelled: 0,
};

export const DEMO_THROUGHPUT_DATA = Array.from({ length: 7 }, (_, dayIndex) => {
  return Array.from({ length: 24 }, (_, hour) => ({
    timestamp: new Date(Date.now() - (6 - dayIndex) * 86400000 + hour * 3600000).toISOString(),
    trains: Math.floor(Math.random() * 15 + 8),
    passengers: Math.floor(Math.random() * 120000 + 80000),
    onTimeRate: Math.floor(Math.random() * 25 + 65),
  }));
}).flat();

export const DEMO_ZONE_PERFORMANCE = [
  { zone: 'NR', name: 'Northern Railway', onTimePercent: 74.2, avgDelay: 16.1, incidents: 12, healthScore: 82 },
  { zone: 'CR', name: 'Central Railway', onTimePercent: 68.9, avgDelay: 22.4, incidents: 18, healthScore: 74 },
  { zone: 'SR', name: 'Southern Railway', onTimePercent: 79.1, avgDelay: 11.8, incidents: 7, healthScore: 88 },
  { zone: 'ER', name: 'Eastern Railway', onTimePercent: 65.3, avgDelay: 28.6, incidents: 21, healthScore: 69 },
  { zone: 'WR', name: 'Western Railway', onTimePercent: 76.8, avgDelay: 14.2, incidents: 9, healthScore: 85 },
  { zone: 'SCR', name: 'South Central Railway', onTimePercent: 81.3, avgDelay: 9.7, incidents: 5, healthScore: 91 },
  { zone: 'NFR', name: 'Northeast Frontier Railway', onTimePercent: 58.4, avgDelay: 41.2, incidents: 29, healthScore: 61 },
  { zone: 'SWR', name: 'South Western Railway', onTimePercent: 83.2, avgDelay: 8.4, incidents: 4, healthScore: 93 },
  { zone: 'ECR', name: 'East Central Railway', onTimePercent: 67.1, avgDelay: 24.8, incidents: 16, healthScore: 72 },
  { zone: 'ECoR', name: 'East Coast Railway', onTimePercent: 77.6, avgDelay: 13.5, incidents: 8, healthScore: 86 },
  { zone: 'NCR', name: 'North Central Railway', onTimePercent: 71.9, avgDelay: 17.8, incidents: 11, healthScore: 79 },
  { zone: 'NWR', name: 'North Western Railway', onTimePercent: 73.4, avgDelay: 15.9, incidents: 10, healthScore: 81 },
  { zone: 'WCR', name: 'West Central Railway', onTimePercent: 70.2, avgDelay: 19.3, incidents: 14, healthScore: 77 },
  { zone: 'SECR', name: 'South East Central Railway', onTimePercent: 75.8, avgDelay: 14.8, incidents: 9, healthScore: 84 },
  { zone: 'SER', name: 'South Eastern Railway', onTimePercent: 69.7, avgDelay: 21.2, incidents: 15, healthScore: 75 },
  { zone: 'NER', name: 'North Eastern Railway', onTimePercent: 63.2, avgDelay: 31.7, incidents: 22, healthScore: 66 },
  { zone: 'MR', name: 'Metro Railway Kolkata', onTimePercent: 94.1, avgDelay: 2.1, incidents: 1, healthScore: 97 },
  { zone: 'ICF', name: 'Integral Coach Factory', onTimePercent: 100, avgDelay: 0, incidents: 0, healthScore: 100 },
];

export const DEMO_MAINTENANCE_ASSETS = [
  { id: 'm1', assetType: 'TRACK', assetCode: 'NR-TRK-NDLS-BSB-001', name: 'NDLS–MGS Main Line Section A', location: 'km 0-200, NDLS–BSB corridor', zone: 'NR', age: 12, lastMaintenance: '2024-06-15', healthScore: 67, riskScore: 73, riskLevel: 'HIGH', nextMaintenance: '2024-09-15' },
  { id: 'm2', assetType: 'SIGNAL', assetCode: 'NR-SIG-NDLS-008', name: 'NDLS Platform 8 Entry Signal', location: 'New Delhi Station, Platform 8', zone: 'NR', age: 8, lastMaintenance: '2024-07-22', healthScore: 34, riskScore: 91, riskLevel: 'CRITICAL', nextMaintenance: 'IMMEDIATE' },
  { id: 'm3', assetType: 'SWITCH', assetCode: 'CR-SWT-CSMT-012', name: 'CSMT Yard Switch #12', location: 'Mumbai CSMT Yard', zone: 'CR', age: 6, lastMaintenance: '2024-08-01', healthScore: 82, riskScore: 28, riskLevel: 'LOW', nextMaintenance: '2025-02-01' },
  { id: 'm4', assetType: 'TRACK', assetCode: 'NFR-TRK-GHY-TSK-001', name: 'GHY–TSK Hill Section', location: 'km 700-850, NFR hill section', zone: 'NFR', age: 18, lastMaintenance: '2024-03-10', healthScore: 45, riskScore: 85, riskLevel: 'CRITICAL', nextMaintenance: '2024-08-20' },
  { id: 'm5', assetType: 'SIGNAL', assetCode: 'ER-SIG-HWH-001', name: 'HWH Main Entry Signal', location: 'Howrah Junction Entry', zone: 'ER', age: 4, lastMaintenance: '2024-08-10', healthScore: 91, riskScore: 15, riskLevel: 'LOW', nextMaintenance: '2025-02-10' },
  { id: 'm6', assetType: 'TRACK', assetCode: 'CR-TRK-CSMT-KYN-002', name: 'CSMT–KYN Fast Line Section B', location: 'km 10-45, CR Main Line', zone: 'CR', age: 9, lastMaintenance: '2024-05-20', healthScore: 58, riskScore: 62, riskLevel: 'MEDIUM', nextMaintenance: '2024-10-01' },
  { id: 'm7', assetType: 'SWITCH', assetCode: 'NR-SWT-NDLS-024', name: 'New Delhi Outer Crossover Switch', location: 'NDLS Outer, km -2.4', zone: 'NR', age: 15, lastMaintenance: '2024-04-18', healthScore: 52, riskScore: 68, riskLevel: 'HIGH', nextMaintenance: '2024-09-01' },
];

export const DEMO_AI_RECOMMENDATIONS = [
  { id: 'r1', priority: 'CRITICAL', title: 'Immediate Track Attention Required', description: 'NR-TRK-NDLS-BSB-001 shows 73% risk score. Schedule urgent tamping within 7 days to prevent TSR imposition.', actions: ['Schedule tamping gang', 'Procure rail screws', 'Notify DRM Varanasi'], impact: 'Prevents potential 30 km/h TSR affecting 45+ trains daily' },
  { id: 'r2', priority: 'HIGH', title: 'Signal Replacement: NDLS P8', description: 'Signal NR-SIG-NDLS-008 failure probability exceeds 90%. Replace relay unit before next peak season.', actions: ['Raise indent for relay unit', 'Schedule night block', 'Deploy manual backup'], impact: 'Eliminates critical signal failure risk at one of Indias busiest stations' },
  { id: 'r3', priority: 'HIGH', title: 'Optimize HWH-NDLS Scheduling', description: 'Cascading delay pattern detected on HWH-NDLS corridor. Recommend 15-minute buffer at PNBE for all Rajdhani trains.', actions: ['Revise working timetable', 'Issue Traffic Circular', 'Update NTES feed'], impact: 'Reduces average delay by 23 minutes for 8 Rajdhani trains' },
  { id: 'r4', priority: 'MEDIUM', title: 'NFR Hill Section Maintenance', description: 'NFR-TRK-GHY-TSK-001 approaching critical threshold (85% risk). Monsoon exposure accelerating deterioration.', actions: ['Deploy track maintenance unit', 'Conduct emergency inspection', 'Impose precautionary TSR'], impact: 'Prevents potential disruption to 12 trains on Northeast connectivity corridor' },
  { id: 'r5', priority: 'MEDIUM', title: 'Passenger Flow Optimization at NDLS', description: 'Platform 1 overcrowding pattern detected during evening peak. Recommend staggering arrivals by 8 minutes.', actions: ['Revise platform assignments', 'Increase RPF deployment', 'Activate crowd management protocol'], impact: 'Improves passenger safety and reduces boarding time by 4 minutes' },
];
