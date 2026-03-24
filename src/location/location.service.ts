import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private notificationService: NotificationService,
  ) {}

  // créer location
  async create(location: Partial<Location>): Promise<Location> {
    const newLocation = this.locationRepository.create(location);
    return this.locationRepository.save(newLocation);
  }

  // confirmer location
  async confirmerLocation(id: number, clientId: number): Promise<void> {
    await this.locationRepository.update(id, { statut: 'confirmée' });
    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Votre location de voiture est confirmée",
      "location"
    );
  }

  // annuler location
  async annulerLocation(id: number, clientId: number): Promise<void> {
    await this.locationRepository.update(id, { statut: 'annulée' });
    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Votre location de voiture a été annulée",
      "location"
    );
  }

  // lister toutes les locations
  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      relations: ['client', 'agenceManager', 'voiture', 'facture'],
    });
  }

  // location par id
  async findOne(id: number): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { idlocation: id },
      relations: ['client', 'agenceManager', 'voiture', 'facture'],
    });
  }

  // supprimer location
  async remove(id: number) {
    return this.locationRepository.delete(id);
  }
}