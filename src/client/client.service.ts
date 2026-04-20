import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  // ===============================
  // ✅ ADMIN → GET ALL CLIENTS
  // ===============================
  async findAll(currentUser: any): Promise<Client[]> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }

    return this.clientRepository.find({
      relations: [
        'reservations',
        'locations',
        'factures', // ✅ corrigé
        'notifications',
        'avis',
      ],
    });
  }

  // ===============================
  // ✅ CLIENT ACCOUNT (sécurisé)
  // ===============================

  async getProfile(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: [
        'reservations',
        'locations',
        'favoris',
        'notifications',
        'avis',
        'factures', // ✅ corrigé
      ],
    });

    if (!client) {
      throw new ForbiddenException('Client not found');
    }

    return client;
  }

  async getReservations(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['reservations'],
    });

    return client?.reservations || [];
  }

  async getLocations(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['locations'],
    });

    return client?.locations || [];
  }

  async getFavoris(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['favoris'],
    });

    return client?.favoris || [];
  }

  async getNotifications(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['notifications'],
    });

    return client?.notifications || [];
  }

  async getAvis(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['avis'],
    });

    return client?.avis || [];
  }

  async getFactures(clientId: number) {
    const client = await this.clientRepository.findOne({
      where: { iduser: clientId },
      relations: ['factures'], // ✅ corrigé
    });

    return client?.factures || []; // ✅ corrigé
  }
}