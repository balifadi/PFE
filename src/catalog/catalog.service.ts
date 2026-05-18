import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hotel } from '../entities/hotel.entity';
import { Agence } from '../entities/agence.entity';
import { Zone } from '../entities/zone.entity';

type PublicRoom = {
  idchambre: number;
  numero: number;
  capacite: number;
  etat: string;
  prix_Nuit: number;
};

type PublicCar = {
  idvoiture: number;
  marque: string;
  modele: string;
  immatriculation: string;
  etat: string;
  prix_Jour: number;
  imagePath: string;
};

type CatalogSummary = {
  hotels: number;
  agences: number;
  zones: number;
  chambres: number;
  voitures: number;
};

@Injectable()
export class CatalogService {
  private readonly hotelFallbackImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764b6a?auto=format&fit=crop&w=1200&q=80',
  ];

  private readonly agencyFallbackImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  ];

  private readonly carFallbackImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  ];

  private readonly zoneFallbackImages = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
  ];

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(Agence)
    private readonly agenceRepository: Repository<Agence>,

    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
  ) {}

  async getLanding() {
    const snapshot = await this.loadCatalogSnapshot(6);
    const mappedHotels = snapshot.hotels.map((hotel, index) => this.mapHotel(hotel, index));
    const mappedAgences = snapshot.agences.map((agence, index) => this.mapAgence(agence, index));
    const mappedZones = snapshot.zones.map((zone, index) => this.mapZone(zone, index));

    return this.buildResponse(mappedHotels, mappedAgences, mappedZones, snapshot.summary);
  }

  async searchLanding(service = 'all', destination = '', term = '') {
    const snapshot = await this.loadCatalogSnapshot();
    const mappedHotels = snapshot.hotels.map((hotel, index) => this.mapHotel(hotel, index));
    const mappedAgences = snapshot.agences.map((agence, index) => this.mapAgence(agence, index));
    const mappedZones = snapshot.zones.map((zone, index) => this.mapZone(zone, index));

    const normalizedTerm = this.normalizeText(term || destination || '');
    const normalizedService = this.normalizeText(service || 'all');

    const filteredHotels =
      normalizedService === 'car' || normalizedService === 'zone'
        ? []
        : mappedHotels.filter((hotel) => this.matchesCatalogText([
            hotel.nom,
            hotel.ville,
            hotel.hotelManager?.nom ?? '',
            hotel.hotelManager?.prenom ?? '',
          ], normalizedTerm));

    const filteredAgences =
      normalizedService === 'hotel' || normalizedService === 'zone'
        ? []
        : mappedAgences.filter((agence) => this.matchesCatalogText([
            agence.nom,
            agence.ville,
            agence.agenceManager?.nom ?? '',
            agence.agenceManager?.prenom ?? '',
          ], normalizedTerm));

    const filteredZones =
      normalizedService === 'hotel' || normalizedService === 'car'
        ? []
        : mappedZones.filter((zone) => this.matchesCatalogText([
            zone.nom,
            zone.ville,
            zone.description,
          ], normalizedTerm));

    return this.buildResponse(filteredHotels, filteredAgences, filteredZones);
  }

  async getHotel(id: number) {
    const hotel = await this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['chambres', 'hotelManager'],
    });

    if (!hotel) {
      throw new NotFoundException('Hotel non trouve');
    }

    return this.mapHotel(hotel, 0);
  }

  async getAgence(id: number) {
    const agence = await this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['voitures', 'agenceManager'],
    });

    if (!agence) {
      throw new NotFoundException('Agence non trouvee');
    }

    return this.mapAgence(agence, 0);
  }

  async getZone(id: number) {
    const zone = await this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });

    if (!zone) {
      throw new NotFoundException('Zone non trouvee');
    }

    return this.mapZone(zone, 0);
  }

  private mapHotel(hotel: Hotel, index: number) {
    const chambres = (hotel.chambres || []).map((chambre) => this.mapRoom(chambre as any));
    const availableRooms = chambres.filter((chambre) =>
      this.isAvailableStatus(chambre.etat),
    ).length;
    const cheapestRoom = chambres.reduce((min, chambre) => {
      const price = Number(chambre.prix_Nuit ?? 0);
      if (!min || price < min) {
        return price;
      }
      return min;
    }, 0);

    return {
      idhotel: hotel.idhotel,
      nom: hotel.nom,
      ville: hotel.ville,
      nb_Etoiles: hotel.nb_Etoiles,
      nb_chambres: Number(hotel.nb_chambres ?? chambres.length ?? 0),
      telephone: hotel.telephone,
      imagePath: this.resolveImagePath(hotel.imagePath, this.hotelFallbackImages, index),
      latitude: Number(hotel.latitude ?? 0),
      longitude: Number(hotel.longitude ?? 0),
      availableRooms,
      priceFrom: cheapestRoom,
      chambres,
      hotelManager: hotel.hotelManager
        ? {
            iduser: hotel.hotelManager.iduser,
            nom: hotel.hotelManager.nom,
            prenom: hotel.hotelManager.prenom,
          }
        : null,
    };
  }

  private mapAgence(agence: Agence, index: number) {
    const voitures = (agence.voitures || []).map((voiture) => this.mapCar(voiture as any));
    const availableCars = voitures.filter((voiture) =>
      this.isAvailableStatus(voiture.etat),
    ).length;
    const cheapestCar = voitures.reduce((min, voiture) => {
      const price = Number(voiture.prix_Jour ?? 0);
      if (!min || price < min) {
        return price;
      }
      return min;
    }, 0);

    return {
      idagence: agence.idagence,
      nom: agence.nom,
      ville: agence.ville,
      telephone: agence.telephone,
      nb_voitures: Number(agence.nb_voitures ?? voitures.length ?? 0),
      imagePath: this.resolveImagePath(agence.imagePath, this.agencyFallbackImages, index),
      latitude: Number(agence.latitude ?? 0),
      longitude: Number(agence.longitude ?? 0),
      availableCars,
      priceFrom: cheapestCar,
      voitures,
      agenceManager: agence.agenceManager
        ? {
            iduser: agence.agenceManager.iduser,
            nom: agence.agenceManager.nom,
            prenom: agence.agenceManager.prenom,
          }
        : null,
    };
  }

  private mapZone(zone: Zone, index: number) {
    return {
      idzone: zone.idzone,
      nom: zone.nom,
      ville: zone.ville,
      description: zone.description,
      imagePath: this.resolveImagePath(zone.imagePath, this.zoneFallbackImages, index),
      latitude: Number(zone.latitude ?? 0),
      longitude: Number(zone.longitude ?? 0),
    };
  }

  private mapRoom(chambre: any): PublicRoom {
    return {
      idchambre: chambre.idchambre,
      numero: Number(chambre.numero ?? 0),
      capacite: Number(chambre.capacite ?? 0),
      etat: String(chambre.etat ?? 'disponible'),
      prix_Nuit: Number(chambre.prix_Nuit ?? 0),
    };
  }

  private mapCar(voiture: any): PublicCar {
    return {
      idvoiture: voiture.idvoiture,
      marque: voiture.marque,
      modele: voiture.modele,
      immatriculation: voiture.immatriculation,
      etat: String(voiture.etat ?? 'disponible'),
      prix_Jour: Number(voiture.prix_Jour ?? 0),
      imagePath: this.resolveImagePath(voiture.imagePath, this.carFallbackImages, voiture.idvoiture ?? 0),
    };
  }

  private buildResponse(
    hotels: any[],
    agences: any[],
    zones: any[],
    summary?: CatalogSummary,
  ) {
    const computedSummary: CatalogSummary =
      summary ?? {
        hotels: hotels.length,
        agences: agences.length,
        zones: zones.length,
        chambres: hotels.reduce((total, hotel) => total + (hotel.chambres?.length ?? 0), 0),
        voitures: agences.reduce((total, agence) => total + (agence.voitures?.length ?? 0), 0),
      };

    return {
      summary: computedSummary,
      featuredHotel: hotels[0] ?? null,
      featuredAgence: agences[0] ?? null,
      featuredZone: zones[0] ?? null,
      hotels,
      agences,
      zones,
    };
  }

  private async loadCatalogSnapshot(take?: number) {
    const hotelQuery: Record<string, any> = {
      relations: ['chambres', 'hotelManager'],
      order: { idhotel: 'DESC' },
    };
    const agenceQuery: Record<string, any> = {
      relations: ['voitures', 'agenceManager'],
      order: { idagence: 'DESC' },
    };
    const zoneQuery: Record<string, any> = {
      relations: ['admin'],
      order: { idzone: 'DESC' },
    };

    if (typeof take === 'number') {
      hotelQuery.take = take;
      agenceQuery.take = take;
      zoneQuery.take = take;
    }

    const [hotels, agences, zones, hotelCount, agenceCount, zoneCount, chambreCount, voitureCount] =
      await Promise.all([
        this.hotelRepository.find(hotelQuery),
        this.agenceRepository.find(agenceQuery),
        this.zoneRepository.find(zoneQuery),
        this.hotelRepository.count(),
        this.agenceRepository.count(),
        this.zoneRepository.count(),
        this.hotelRepository
          .createQueryBuilder('hotel')
          .leftJoin('hotel.chambres', 'chambre')
          .select('COUNT(chambre.idchambre)', 'count')
          .getRawOne(),
        this.agenceRepository
          .createQueryBuilder('agence')
          .leftJoin('agence.voitures', 'voiture')
          .select('COUNT(voiture.idvoiture)', 'count')
          .getRawOne(),
      ]);

    return {
      hotels,
      agences,
      zones,
      summary: {
        hotels: hotelCount,
        agences: agenceCount,
        zones: zoneCount,
        chambres: Number((chambreCount as any)?.count ?? 0),
        voitures: Number((voitureCount as any)?.count ?? 0),
      } as CatalogSummary,
    };
  }

  private normalizeText(value: string) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private matchesCatalogText(values: Array<string | null | undefined>, term: string): boolean {
    if (!term) return true;
    const normalizedValues = values.map((value) => this.normalizeText(String(value ?? '')));
    return normalizedValues.some((value) => value.includes(term));
  }

  private resolveImagePath(
    imagePath: string | null | undefined,
    fallbackList: string[],
    index: number,
  ): string {
    const fallback = fallbackList[index % fallbackList.length];

    if (!imagePath || !String(imagePath).trim()) {
      return fallback;
    }

    const value = String(imagePath).trim();

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    if (value.startsWith('assets/')) {
      return value;
    }

    if (value.startsWith('/')) {
      return `http://localhost:3000${value}`;
    }

    return `http://localhost:3000/uploads/${value}`;
  }

  private isAvailableStatus(status: string): boolean {
    const normalized = String(status ?? '').toLowerCase();
    return normalized === 'disponible' || normalized === 'active';
  }
}
