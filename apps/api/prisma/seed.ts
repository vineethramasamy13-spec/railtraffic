import { PrismaClient, Role, TrainStatus, AlertSeverity, AlertCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create Stations
  const stationsData = [
    { code: 'NDLS', name: 'New Delhi', nameHindi: 'नई दिल्ली', latitude: 28.6428, longitude: 77.2197, zone: 'NR', division: 'DELHI', state: 'Delhi', city: 'New Delhi', totalPlatforms: 16, isJunction: true },
    { code: 'CSMT', name: 'Mumbai CSMT', nameHindi: 'मुंबई सीएसएमटी', latitude: 18.9398, longitude: 72.8355, zone: 'CR', division: 'MUMBAI', state: 'Maharashtra', city: 'Mumbai', totalPlatforms: 18, isJunction: false },
    { code: 'MAS', name: 'Chennai Central', nameHindi: 'चेन्नई सेंट्रल', latitude: 13.0827, longitude: 80.2750, zone: 'SR', division: 'CHENNAI', state: 'Tamil Nadu', city: 'Chennai', totalPlatforms: 17, isJunction: true },
    { code: 'HWH', name: 'Howrah', nameHindi: 'हावड़ा', latitude: 22.5839, longitude: 88.3423, zone: 'ER', division: 'HOWRAH', state: 'West Bengal', city: 'Kolkata', totalPlatforms: 23, isJunction: true },
    { code: 'SBC', name: 'KSR Bengaluru', nameHindi: 'केएसआर बेंगलुरु', latitude: 12.9784, longitude: 77.5680, zone: 'SWR', division: 'BENGALURU', state: 'Karnataka', city: 'Bengaluru', totalPlatforms: 10, isJunction: true },
    { code: 'SC', name: 'Secunderabad', nameHindi: 'सिकंदराबाद', latitude: 17.4339, longitude: 78.5018, zone: 'SCR', division: 'SECUNDERABAD', state: 'Telangana', city: 'Hyderabad', totalPlatforms: 10, isJunction: true },
    { code: 'ADI', name: 'Ahmedabad', nameHindi: 'अहमदाबाद', latitude: 23.0258, longitude: 72.5974, zone: 'WR', division: 'AHMEDABAD', state: 'Gujarat', city: 'Ahmedabad', totalPlatforms: 12, isJunction: true },
    { code: 'PUNE', name: 'Pune Junction', nameHindi: 'पुणे जंक्शन', latitude: 18.5289, longitude: 73.8741, zone: 'CR', division: 'PUNE', state: 'Maharashtra', city: 'Pune', totalPlatforms: 6, isJunction: true },
    { code: 'JP', name: 'Jaipur', nameHindi: 'जयपुर', latitude: 26.9124, longitude: 75.7873, zone: 'NWR', division: 'JAIPUR', state: 'Rajasthan', city: 'Jaipur', totalPlatforms: 7, isJunction: true },
    { code: 'LKO', name: 'Lucknow NR', nameHindi: 'लखनऊ एनआर', latitude: 26.8467, longitude: 80.9462, zone: 'NR', division: 'LUCKNOW', state: 'Uttar Pradesh', city: 'Lucknow', totalPlatforms: 9, isJunction: true },
    { code: 'PNBE', name: 'Patna Junction', nameHindi: 'पटना जंक्शन', latitude: 25.5941, longitude: 85.1376, zone: 'ECR', division: 'DANAPUR', state: 'Bihar', city: 'Patna', totalPlatforms: 10, isJunction: true },
    { code: 'BPL', name: 'Bhopal Junction', nameHindi: 'भोपाल जंक्शन', latitude: 23.2599, longitude: 77.4126, zone: 'WCR', division: 'BHOPAL', state: 'Madhya Pradesh', city: 'Bhopal', totalPlatforms: 6, isJunction: true },
    { code: 'NGP', name: 'Nagpur', nameHindi: 'नागपुर', latitude: 21.1458, longitude: 79.0882, zone: 'CR', division: 'NAGPUR', state: 'Maharashtra', city: 'Nagpur', totalPlatforms: 8, isJunction: true },
    { code: 'ST', name: 'Surat', nameHindi: 'सूरत', latitude: 21.2047, longitude: 72.8370, zone: 'WR', division: 'MUMBAI CENTRAL', state: 'Gujarat', city: 'Surat', totalPlatforms: 4, isJunction: false },
    { code: 'BSB', name: 'Varanasi Junction', nameHindi: 'वाराणसी जंक्शन', latitude: 25.3176, longitude: 82.9739, zone: 'NR', division: 'LUCKNOW', state: 'Uttar Pradesh', city: 'Varanasi', totalPlatforms: 9, isJunction: true },
    { code: 'ASR', name: 'Amritsar', nameHindi: 'अमृतसर', latitude: 31.6340, longitude: 74.8723, zone: 'NR', division: 'FIROZPUR', state: 'Punjab', city: 'Amritsar', totalPlatforms: 6, isJunction: true },
    { code: 'CDG', name: 'Chandigarh', nameHindi: 'चंडीगढ़', latitude: 30.7333, longitude: 76.7794, zone: 'NR', division: 'AMBALA', state: 'Chandigarh', city: 'Chandigarh', totalPlatforms: 6, isJunction: false },
    { code: 'ERS', name: 'Ernakulam Junction', nameHindi: 'एर्नाकुलम जंक्शन', latitude: 9.9816, longitude: 76.2999, zone: 'SR', division: 'THIRUVANANTHAPURAM', state: 'Kerala', city: 'Kochi', totalPlatforms: 6, isJunction: true },
    { code: 'GHY', name: 'Guwahati', nameHindi: 'गुवाहाटी', latitude: 26.1445, longitude: 91.7362, zone: 'NFR', division: 'LUMDING', state: 'Assam', city: 'Guwahati', totalPlatforms: 7, isJunction: true },
    { code: 'BBS', name: 'Bhubaneswar', nameHindi: 'भुवनेश्वर', latitude: 20.2961, longitude: 85.8245, zone: 'ECoR', division: 'KHURDA ROAD', state: 'Odisha', city: 'Bhubaneswar', totalPlatforms: 6, isJunction: false },
  ];

  const stations = [];
  for (const stData of stationsData) {
    const station = await prisma.station.upsert({
      where: { code: stData.code },
      update: {},
      create: stData,
    });
    stations.push(station);
    
    // Create platforms for station
    for (let i = 1; i <= station.totalPlatforms; i++) {
      await prisma.platform.create({
        data: {
          stationId: station.id,
          number: i.toString(),
        }
      });
    }
  }

  // 2. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const ndlsId = stations.find(s => s.code === 'NDLS')?.id;

  const usersData = [
    { email: 'admin@railway.gov.in', name: 'System Admin', role: Role.ADMIN, passwordHash },
    { email: 'stationmaster.ndls@railway.gov.in', name: 'NDLS Master', role: Role.STATION_MASTER, passwordHash, stationId: ndlsId },
    { email: 'zonemanager.nr@railway.gov.in', name: 'NR Manager', role: Role.ZONE_MANAGER, passwordHash, zoneId: 'NR' },
    { email: 'operator1@railway.gov.in', name: 'Control Room Op', role: Role.OPERATOR, passwordHash },
    { email: 'viewer@railway.gov.in', name: 'Guest Viewer', role: Role.VIEWER, passwordHash },
  ];

  for (const uData of usersData) {
    await prisma.user.upsert({
      where: { email: uData.email },
      update: {},
      create: uData,
    });
  }

  // 3. Create Trains
  const trainsData = [
    { trainNumber: '12301', trainName: 'Howrah Rajdhani', category: 'Rajdhani', origin: 'Howrah', destination: 'New Delhi', originCode: 'HWH', destinationCode: 'NDLS', zone: 'ER' },
    { trainNumber: '12302', trainName: 'Howrah Rajdhani', category: 'Rajdhani', origin: 'New Delhi', destination: 'Howrah', originCode: 'NDLS', destinationCode: 'HWH', zone: 'ER' },
    { trainNumber: '12951', trainName: 'Mumbai Rajdhani', category: 'Rajdhani', origin: 'Mumbai Central', destination: 'New Delhi', originCode: 'MMCT', destinationCode: 'NDLS', zone: 'WR' },
    { trainNumber: '12431', trainName: 'Trivandrum Rajdhani', category: 'Rajdhani', origin: 'Thiruvananthapuram', destination: 'Nizamuddin', originCode: 'TVC', destinationCode: 'NZM', zone: 'NR' },
    { trainNumber: '12009', trainName: 'Mumbai Shatabdi', category: 'Shatabdi', origin: 'Mumbai Central', destination: 'Ahmedabad', originCode: 'MMCT', destinationCode: 'ADI', zone: 'WR' },
    { trainNumber: '12010', trainName: 'Mumbai Shatabdi', category: 'Shatabdi', origin: 'Ahmedabad', destination: 'Mumbai Central', originCode: 'ADI', destinationCode: 'MMCT', zone: 'WR' },
    { trainNumber: '22439', trainName: 'New Delhi Vande Bharat', category: 'Vande Bharat', origin: 'New Delhi', destination: 'Katra', originCode: 'NDLS', destinationCode: 'SVDK', zone: 'NR' },
    { trainNumber: '22436', trainName: 'Vande Bharat Express', category: 'Vande Bharat', origin: 'New Delhi', destination: 'Varanasi', originCode: 'NDLS', destinationCode: 'BSB', zone: 'NR' },
    { trainNumber: '12627', trainName: 'Karnataka Express', category: 'Superfast', origin: 'KSR Bengaluru', destination: 'New Delhi', originCode: 'SBC', destinationCode: 'NDLS', zone: 'SWR' },
    { trainNumber: '12628', trainName: 'Karnataka Express', category: 'Superfast', origin: 'New Delhi', destination: 'KSR Bengaluru', originCode: 'NDLS', destinationCode: 'SBC', zone: 'SWR' },
    { trainNumber: '12001', trainName: 'New Bhopal Shatabdi', category: 'Shatabdi', origin: 'Rani Kamlapati', destination: 'New Delhi', originCode: 'RKMP', destinationCode: 'NDLS', zone: 'WCR' },
  ];

  const now = new Date();
  
  for (const tData of trainsData) {
    const scheduledDep = new Date(now.getTime() - Math.random() * 86400000);
    const scheduledArr = new Date(scheduledDep.getTime() + Math.random() * 86400000 + 3600000);
    const delay = Math.floor(Math.random() * 120);
    const estArr = new Date(scheduledArr.getTime() + delay * 60000);

    await prisma.train.upsert({
      where: { trainNumber: tData.trainNumber },
      update: {},
      create: {
        ...tData,
        scheduledDeparture: scheduledDep,
        scheduledArrival: scheduledArr,
        actualDeparture: scheduledDep,
        estimatedArrival: estArr,
        delayMinutes: delay,
        status: delay > 15 ? TrainStatus.DELAYED : TrainStatus.ON_TIME,
        occupancy: Math.floor(Math.random() * 40) + 60,
        capacity: 1000,
        currentStation: tData.originCode,
        nextStation: tData.destinationCode,
      },
    });
  }

  // 4. Create Alerts
  const sampleTrains = await prisma.train.findMany({ take: 5 });
  
  for (let i = 0; i < 15; i++) {
    const train = sampleTrains[i % sampleTrains.length];
    const station = stations[i % stations.length];
    
    await prisma.alert.create({
      data: {
        title: `Alert ${i + 1}`,
        description: `Sample alert description ${i + 1}`,
        severity: i % 3 === 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
        category: i % 2 === 0 ? AlertCategory.DELAY : AlertCategory.WEATHER,
        trainId: train.id,
        trainNumber: train.trainNumber,
        stationId: station.id,
        stationCode: station.code,
        aiRootCause: 'Weather conditions and track maintenance',
        recommendedAction: 'Notify passengers and adjust schedule',
      }
    });
  }

  // 5. Create Maintenance Assets
  const assetTypes = ['TRACK', 'SIGNAL', 'SWITCH', 'BRIDGE', 'LEVEL_CROSSING'];
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const zones = ['NR', 'CR', 'SR', 'ER', 'WR'];

  for (let i = 0; i < 50; i++) {
    const assetType = assetTypes[i % assetTypes.length] as any;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)] as any;
    const zone = zones[i % zones.length];
    
    await prisma.maintenanceAsset.upsert({
      where: { assetCode: `${zone}-${assetType.substring(0, 3)}-00${i}` },
      update: {},
      create: {
        assetType,
        assetCode: `${zone}-${assetType.substring(0, 3)}-00${i}`,
        name: `${assetType} Location ${i}`,
        location: `KM ${Math.floor(Math.random() * 500)}`,
        zone,
        age: Math.floor(Math.random() * 30),
        lastMaintenance: new Date(now.getTime() - Math.random() * 86400000 * 365 * 3), // Up to 3 years ago
        usageCount: Math.floor(Math.random() * 1000000),
        healthScore: Math.random() * 100,
        riskScore: Math.random() * 100,
        riskLevel,
        nextMaintenance: new Date(now.getTime() + Math.random() * 86400000 * 30), // Within next 30 days
        notes: `Historical replay dataset entry ${i}`,
      }
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
