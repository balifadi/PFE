import { INestApplicationContext, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from '../entities/admin.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { AgenceManager } from '../entities/agence-manager.entity';
import { Client } from '../entities/client.entity';
import { Hotel } from '../entities/hotel.entity';
import { Chambre } from '../entities/chambre.entity';
import { Agence } from '../entities/agence.entity';
import { Voiture } from '../entities/voiture.entity';
import { Zone } from '../entities/zone.entity';

const logger = new Logger('DemoCatalogSeed');

const DEMO_PASSWORD = 'Demo123!';

type UserSeed = {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: 'admin' | 'client' | 'hotel-manager' | 'agence-manager';
};

type HotelBlueprint = {
  nom: string;
  ville: string;
  stars: number;
  telephone: string;
  latitude: number;
  longitude: number;
  imagePath: string;
  managerIndex: number;
  rooms: number;
  roomBasePrice: number;
};

type AgencyBlueprint = {
  nom: string;
  ville: string;
  telephone: string;
  latitude: number;
  longitude: number;
  imagePath: string;
  managerIndex: number;
  cars: number;
  carBasePrice: number;
  code: string;
};

type ZoneBlueprint = {
  nom: string;
  ville: string;
  description: string;
  latitude: number;
  longitude: number;
  imagePath: string;
};

type CarTemplate = {
  marque: string;
  modele: string;
  imagePath: string;
};

const hotelManagers: UserSeed[] = [
  {
    email: 'hotel.manager1@tourisme.tn',
    nom: 'Ben Salem',
    prenom: 'Nader',
    telephone: '20001001',
    role: 'hotel-manager',
  },
  {
    email: 'hotel.manager2@tourisme.tn',
    nom: 'Trabelsi',
    prenom: 'Amine',
    telephone: '20001002',
    role: 'hotel-manager',
  },
  {
    email: 'hotel.manager3@tourisme.tn',
    nom: 'Gharbi',
    prenom: 'Meriem',
    telephone: '20001003',
    role: 'hotel-manager',
  },
  {
    email: 'hotel.manager4@tourisme.tn',
    nom: 'Jemli',
    prenom: 'Sami',
    telephone: '20001004',
    role: 'hotel-manager',
  },
];

const agenceManagers: UserSeed[] = [
  {
    email: 'agency.manager1@tourisme.tn',
    nom: 'Saidi',
    prenom: 'Yassine',
    telephone: '20002001',
    role: 'agence-manager',
  },
  {
    email: 'agency.manager2@tourisme.tn',
    nom: 'Khelifi',
    prenom: 'Maha',
    telephone: '20002002',
    role: 'agence-manager',
  },
  {
    email: 'agency.manager3@tourisme.tn',
    nom: 'Mansour',
    prenom: 'Omar',
    telephone: '20002003',
    role: 'agence-manager',
  },
  {
    email: 'agency.manager4@tourisme.tn',
    nom: 'Bouzid',
    prenom: 'Amina',
    telephone: '20002004',
    role: 'agence-manager',
  },
];

const clientSeed: UserSeed = {
  email: 'client.demo@tourisme.tn',
  nom: 'Demo',
  prenom: 'Client',
  telephone: '20003001',
  role: 'client',
};

const adminSeed: UserSeed = {
  email: 'admin@tourisme.tn',
  nom: 'Admin',
  prenom: 'Tourisme',
  telephone: '20000000',
  role: 'admin',
};

const hotelBlueprints: HotelBlueprint[] = [
  {
    nom: 'The Residence Tunis',
    ville: 'Gammarth',
    stars: 5,
    telephone: '71750000',
    latitude: 36.927,
    longitude: 10.277,
    imagePath: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    rooms: 6,
    roomBasePrice: 320,
  },
  {
    nom: 'La Badira',
    ville: 'Hammamet',
    stars: 5,
    telephone: '72280000',
    latitude: 36.390,
    longitude: 10.553,
    imagePath: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    rooms: 5,
    roomBasePrice: 280,
  },
  {
    nom: 'Royal Tulip Taj Sultan',
    ville: 'Hammamet',
    stars: 5,
    telephone: '72280555',
    latitude: 36.405,
    longitude: 10.572,
    imagePath: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    rooms: 6,
    roomBasePrice: 250,
  },
  {
    nom: 'Movenpick Resort & Marine Spa',
    ville: 'Sousse',
    stars: 5,
    telephone: '73360000',
    latitude: 35.835,
    longitude: 10.639,
    imagePath: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 2,
    rooms: 6,
    roomBasePrice: 230,
  },
  {
    nom: 'Iberostar Selection Diar El Andalous',
    ville: 'Port El Kantaoui',
    stars: 5,
    telephone: '73374000',
    latitude: 35.885,
    longitude: 10.586,
    imagePath: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 2,
    rooms: 5,
    roomBasePrice: 240,
  },
  {
    nom: 'Dar Ismail Tabarka',
    ville: 'Tabarka',
    stars: 5,
    telephone: '78670000',
    latitude: 36.956,
    longitude: 8.760,
    imagePath: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210d3?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 3,
    rooms: 5,
    roomBasePrice: 210,
  },
  {
    nom: 'Ksar Rouge Tozeur',
    ville: 'Tozeur',
    stars: 4,
    telephone: '76450000',
    latitude: 33.920,
    longitude: 8.133,
    imagePath: 'https://images.unsplash.com/photo-1519822474522-1f5e0d8e2f54?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 3,
    rooms: 5,
    roomBasePrice: 190,
  },
  {
    nom: 'Mahdia Palace Resort',
    ville: 'Mahdia',
    stars: 5,
    telephone: '73620000',
    latitude: 35.504,
    longitude: 11.047,
    imagePath: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    rooms: 5,
    roomBasePrice: 180,
  },
  {
    nom: 'Golden Tulip El Mechtel',
    ville: 'Tunis',
    stars: 4,
    telephone: '71899000',
    latitude: 36.826,
    longitude: 10.146,
    imagePath: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    rooms: 6,
    roomBasePrice: 170,
  },
  {
    nom: 'Radisson Blu Resort & Thalasso',
    ville: 'Hammamet',
    stars: 5,
    telephone: '72294000',
    latitude: 36.366,
    longitude: 10.553,
    imagePath: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    rooms: 5,
    roomBasePrice: 290,
  },
  {
    nom: 'Sentido Bellevue Park',
    ville: 'Sousse',
    stars: 5,
    telephone: '73270000',
    latitude: 35.887,
    longitude: 10.593,
    imagePath: 'https://images.unsplash.com/photo-1520637836862-4d197d17c8b0?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 2,
    rooms: 5,
    roomBasePrice: 220,
  },
  {
    nom: 'Dar El Bhar Djerba',
    ville: 'Djerba',
    stars: 4,
    telephone: '75740000',
    latitude: 33.807,
    longitude: 10.846,
    imagePath: 'https://images.unsplash.com/photo-1506059612708-99d6d6c9f4f9?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 3,
    rooms: 5,
    roomBasePrice: 175,
  },
];

const agencyBlueprints: AgencyBlueprint[] = [
  {
    nom: 'Tunis Auto Premium',
    ville: 'Tunis',
    telephone: '71910000',
    latitude: 36.806,
    longitude: 10.181,
    imagePath: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    cars: 5,
    carBasePrice: 110,
    code: 'TUN',
  },
  {
    nom: 'Hammamet Rent Car',
    ville: 'Hammamet',
    telephone: '72210000',
    latitude: 36.401,
    longitude: 10.616,
    imagePath: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    cars: 5,
    carBasePrice: 95,
    code: 'HAM',
  },
  {
    nom: 'Sousse Mobility',
    ville: 'Sousse',
    telephone: '73210000',
    latitude: 35.825,
    longitude: 10.637,
    imagePath: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 2,
    cars: 5,
    carBasePrice: 100,
    code: 'SOU',
  },
  {
    nom: 'Djerba Road',
    ville: 'Djerba',
    telephone: '75710000',
    latitude: 33.807,
    longitude: 10.845,
    imagePath: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 3,
    cars: 4,
    carBasePrice: 120,
    code: 'DJE',
  },
  {
    nom: 'Tozeur Desert Drive',
    ville: 'Tozeur',
    telephone: '76410000',
    latitude: 33.920,
    longitude: 8.133,
    imagePath: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    cars: 4,
    carBasePrice: 140,
    code: 'TOZ',
  },
  {
    nom: 'Tabarka Explorer Cars',
    ville: 'Tabarka',
    telephone: '78610000',
    latitude: 36.956,
    longitude: 8.760,
    imagePath: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    cars: 4,
    carBasePrice: 105,
    code: 'TAB',
  },
  {
    nom: 'Mahdia Car Center',
    ville: 'Mahdia',
    telephone: '73610000',
    latitude: 35.504,
    longitude: 11.047,
    imagePath: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 2,
    cars: 4,
    carBasePrice: 98,
    code: 'MAH',
  },
  {
    nom: 'Nabeul Drive',
    ville: 'Nabeul',
    telephone: '72310000',
    latitude: 36.452,
    longitude: 10.735,
    imagePath: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 3,
    cars: 5,
    carBasePrice: 92,
    code: 'NAB',
  },
  {
    nom: 'Sfax City Rent',
    ville: 'Sfax',
    telephone: '74410000',
    latitude: 34.740,
    longitude: 10.760,
    imagePath: 'https://images.unsplash.com/photo-1549921296-3a4c2c8b4b66?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 0,
    cars: 4,
    carBasePrice: 90,
    code: 'SFA',
  },
  {
    nom: 'Monastir Wheels',
    ville: 'Monastir',
    telephone: '73510000',
    latitude: 35.777,
    longitude: 10.826,
    imagePath: 'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1200&q=80',
    managerIndex: 1,
    cars: 4,
    carBasePrice: 104,
    code: 'MON',
  },
];

const zoneBlueprints: ZoneBlueprint[] = [
  {
    nom: 'Sidi Bou Said',
    ville: 'Tunis',
    description: 'Village bleu et blanc emblématique avec vue sur la Méditerranée et cafés panoramiques.',
    latitude: 36.870,
    longitude: 10.347,
    imagePath: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Carthage',
    ville: 'Tunis',
    description: 'Site archéologique majeur, musée, thermes et histoire punique au bord de la mer.',
    latitude: 36.857,
    longitude: 10.330,
    imagePath: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Yasmine Hammamet',
    ville: 'Hammamet',
    description: 'Quartier touristique moderne avec marina, plage, loisirs et hôtels de charme.',
    latitude: 36.372,
    longitude: 10.534,
    imagePath: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Port El Kantaoui',
    ville: 'Sousse',
    description: 'Marina, restaurants, golf et activités nautiques dans l’un des pôles balnéaires les plus connus.',
    latitude: 35.894,
    longitude: 10.594,
    imagePath: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Médina de Sousse',
    ville: 'Sousse',
    description: 'Centre historique classé, remparts, souks et patrimoine vivant en bord de mer.',
    latitude: 35.827,
    longitude: 10.640,
    imagePath: 'https://images.unsplash.com/photo-1539650116574-75c0c6d3e3b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Houmt Souk',
    ville: 'Djerba',
    description: 'Capitale de Djerba, marchés traditionnels, port et ambiance insulaire authentique.',
    latitude: 33.878,
    longitude: 10.850,
    imagePath: 'https://images.unsplash.com/photo-1518173946683-2f6b6e8f8c3f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Oasis de Tozeur',
    ville: 'Tozeur',
    description: 'Palmeraies, maisons de briques et excursions vers le désert et les oasis du sud.',
    latitude: 33.920,
    longitude: 8.133,
    imagePath: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Chott el Jerid',
    ville: 'Tozeur',
    description: 'Lac salé spectaculaire, mirages et paysages lunaires au coeur du sud tunisien.',
    latitude: 33.800,
    longitude: 8.500,
    imagePath: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Tabarka Corniche',
    ville: 'Tabarka',
    description: 'Falaises, mer, plongée et coraux dans une destination nature au nord-ouest.',
    latitude: 36.957,
    longitude: 8.758,
    imagePath: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Mahdia Old Port',
    ville: 'Mahdia',
    description: 'Port historique, plages claires et vieille ville avec une atmosphère paisible.',
    latitude: 35.507,
    longitude: 11.062,
    imagePath: 'https://images.unsplash.com/photo-1493244040629-496f6d136cc9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'El Jem Amphitheatre',
    ville: 'El Jem',
    description: 'Amphithéâtre romain, patrimoine mondial et destination historique incontournable.',
    latitude: 35.303,
    longitude: 10.717,
    imagePath: 'https://images.unsplash.com/photo-1506399558188-acca6f1f3c5e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    nom: 'Ichkeul National Park',
    ville: 'Bizerte',
    description: 'Lac, oiseaux migrateurs et nature protégée pour les visiteurs qui aiment les paysages calmes.',
    latitude: 37.160,
    longitude: 9.675,
    imagePath: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
  },
];

const carTemplates: CarTemplate[] = [
  {
    marque: 'Peugeot',
    modele: '308',
    imagePath: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Renault',
    modele: 'Clio',
    imagePath: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Toyota',
    modele: 'Corolla',
    imagePath: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Dacia',
    modele: 'Duster',
    imagePath: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Hyundai',
    modele: 'Tucson',
    imagePath: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Kia',
    modele: 'Sportage',
    imagePath: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Suzuki',
    modele: 'Swift',
    imagePath: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
  {
    marque: 'Volkswagen',
    modele: 'Golf',
    imagePath: 'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=900&q=80',
  },
];

function buildHotelRooms(index: number, count: number, basePrice: number) {
  return Array.from({ length: count }, (_, roomIndex) => {
    const state = roomIndex === count - 1 ? 'maintenance' : roomIndex === 1 ? 'occupee' : 'disponible';

    return {
      numero: index * 100 + roomIndex + 1,
      capacite: roomIndex % 3 === 0 ? 2 : roomIndex % 3 === 1 ? 3 : 4,
      etat: state,
      prix_Nuit: basePrice + roomIndex * 30,
    };
  });
}

function buildAgencyCars(agencyIndex: number, code: string, count: number, basePrice: number) {
  return Array.from({ length: count }, (_, carIndex) => {
    const template = carTemplates[(agencyIndex * 3 + carIndex) % carTemplates.length];
    const state = carIndex === count - 1 ? 'maintenance' : carIndex === 1 ? 'louée' : 'disponible';

    return {
      marque: template.marque,
      modele: template.modele,
      immatriculation: `${code}-${String(agencyIndex + 1).padStart(2, '0')}-${String(carIndex + 1).padStart(2, '0')} TN`,
      etat: state,
      prix_Jour: basePrice + carIndex * 20,
      imagePath: template.imagePath,
    };
  });
}

function normalizeText(value: string) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function ensureUser(repo: Repository<any>, seed: UserSeed, passwordHash: string) {
  const existing = await repo.findOne({ where: { email: seed.email } });

  if (existing) {
    Object.assign(existing, {
      nom: seed.nom,
      prenom: seed.prenom,
      telephone: seed.telephone,
      role: seed.role,
      password: passwordHash,
    });
    return repo.save(existing);
  }

  return repo.save(
    repo.create({
      ...seed,
      password: passwordHash,
    }),
  );
}

async function ensureHotelRooms(
  chambreRepo: Repository<any>,
  hotel: Hotel,
  manager: HotelManager,
  roomSeeds: Array<{ numero: number; capacite: number; etat: string; prix_Nuit: number }>,
) {
  for (const roomSeed of roomSeeds) {
    const existing = await chambreRepo.findOne({
      where: {
        hotel: { idhotel: hotel.idhotel },
        numero: roomSeed.numero,
      },
    });

    if (existing) {
      Object.assign(existing, {
        ...roomSeed,
        hotel,
        hotelManager: manager,
      });
      await chambreRepo.save(existing);
      continue;
    }

    await chambreRepo.save(
      chambreRepo.create({
        ...roomSeed,
        hotel,
        hotelManager: manager,
      }),
    );
  }
}

async function ensureAgencyCars(
  voitureRepo: Repository<any>,
  agence: Agence,
  manager: AgenceManager,
  carSeeds: Array<{
    marque: string;
    modele: string;
    immatriculation: string;
    etat: string;
    prix_Jour: number;
    imagePath: string;
  }>,
) {
  for (const carSeed of carSeeds) {
    const existing = await voitureRepo.findOne({
      where: {
        immatriculation: carSeed.immatriculation,
      },
    });

    if (existing) {
      Object.assign(existing, {
        ...carSeed,
        agence,
        agenceManager: manager,
      });
      await voitureRepo.save(existing);
      continue;
    }

    await voitureRepo.save(
      voitureRepo.create({
        ...carSeed,
        agence,
        agenceManager: manager,
      }),
    );
  }
}

export async function seedDemoCatalog(app: INestApplicationContext) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const adminRepo = app.get<Repository<any>>(getRepositoryToken(Admin));
  const hotelManagerRepo = app.get<Repository<any>>(getRepositoryToken(HotelManager));
  const agenceManagerRepo = app.get<Repository<any>>(getRepositoryToken(AgenceManager));
  const clientRepo = app.get<Repository<any>>(getRepositoryToken(Client));
  const hotelRepo = app.get<Repository<any>>(getRepositoryToken(Hotel));
  const chambreRepo = app.get<Repository<any>>(getRepositoryToken(Chambre));
  const agenceRepo = app.get<Repository<any>>(getRepositoryToken(Agence));
  const voitureRepo = app.get<Repository<any>>(getRepositoryToken(Voiture));
  const zoneRepo = app.get<Repository<any>>(getRepositoryToken(Zone));

  const admin = await ensureUser(adminRepo, adminSeed, passwordHash);
  const client = await ensureUser(clientRepo, clientSeed, passwordHash);

  const seededHotelManagers: HotelManager[] = [];
  for (const seed of hotelManagers) {
    seededHotelManagers.push(await ensureUser(hotelManagerRepo, seed, passwordHash));
  }

  const seededAgenceManagers: AgenceManager[] = [];
  for (const seed of agenceManagers) {
    seededAgenceManagers.push(await ensureUser(agenceManagerRepo, seed, passwordHash));
  }

  for (const [index, blueprint] of hotelBlueprints.entries()) {
    const manager = seededHotelManagers[blueprint.managerIndex];
    let hotel = await hotelRepo.findOne({
      where: { nom: blueprint.nom },
      relations: ['chambres', 'hotelManager'],
    });

    if (!hotel) {
      hotel = hotelRepo.create({});
    }

    Object.assign(hotel, {
      nom: blueprint.nom,
      ville: blueprint.ville,
      nb_Etoiles: blueprint.stars,
      nb_chambres: blueprint.rooms,
      telephone: blueprint.telephone,
      imagePath: blueprint.imagePath,
      latitude: blueprint.latitude,
      longitude: blueprint.longitude,
      admin,
      hotelManager: manager,
    });

    hotel = await hotelRepo.save(hotel);

    const roomSeeds = buildHotelRooms(index + 1, blueprint.rooms, blueprint.roomBasePrice);
    await ensureHotelRooms(chambreRepo, hotel, manager, roomSeeds);
  }

  for (const [index, blueprint] of agencyBlueprints.entries()) {
    const manager = seededAgenceManagers[blueprint.managerIndex];
    let agence = await agenceRepo.findOne({
      where: { nom: blueprint.nom },
      relations: ['voitures', 'agenceManager'],
    });

    if (!agence) {
      agence = agenceRepo.create({});
    }

    Object.assign(agence, {
      nom: blueprint.nom,
      ville: blueprint.ville,
      telephone: blueprint.telephone,
      nb_voitures: blueprint.cars,
      imagePath: blueprint.imagePath,
      latitude: blueprint.latitude,
      longitude: blueprint.longitude,
      admin,
      agenceManager: manager,
    });

    agence = await agenceRepo.save(agence);

    const carSeeds = buildAgencyCars(index + 1, blueprint.code, blueprint.cars, blueprint.carBasePrice);
    await ensureAgencyCars(voitureRepo, agence, manager, carSeeds);
  }

  for (const blueprint of zoneBlueprints) {
    const existing = await zoneRepo.findOne({ where: { nom: blueprint.nom } });

    if (existing) {
      Object.assign(existing, {
        ...blueprint,
        admin,
      });
      await zoneRepo.save(existing);
      continue;
    }

    await zoneRepo.save(
      zoneRepo.create({
        ...blueprint,
        admin,
      }),
    );
  }

  const [hotelCount, agenceCount, zoneCount, chambreCount, voitureCount] = await Promise.all([
    hotelRepo.count(),
    agenceRepo.count(),
    zoneRepo.count(),
    chambreRepo.count(),
    voitureRepo.count(),
  ]);

  logger.log(
    `Demo catalog seeded: ${hotelCount} hotels, ${agenceCount} agences, ${zoneCount} zones, ${chambreCount} chambres, ${voitureCount} voitures.`,
  );
  logger.log(`Demo credentials:`);
  logger.log(`admin@tourisme.tn / ${DEMO_PASSWORD}`);
  logger.log(`client.demo@tourisme.tn / ${DEMO_PASSWORD}`);

  return {
    admin,
    client,
    hotelManagers: seededHotelManagers,
    agenceManagers: seededAgenceManagers,
    counts: {
      hotels: hotelCount,
      agences: agenceCount,
      zones: zoneCount,
      chambres: chambreCount,
      voitures: voitureCount,
    },
  };
}

export const demoCatalogPassword = DEMO_PASSWORD;
