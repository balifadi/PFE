import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateContactDto, clientId: number) {
    const contact = this.contactRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      telephone: dto.telephone,
      email: dto.email,
      message: dto.message,
      client: { iduser: clientId }
    });

    return this.contactRepo.save(contact);
  }

  // ================= FIND ALL =================
  async findAll() {
    return this.contactRepo.find({
      relations: ['client'],
      order: { id: 'DESC' }
    });
  }

  // ================= FIND ONE =================
  async findOne(id: number) {
    const contact = await this.contactRepo.findOne({
      where: { id },
      relations: ['client']
    });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    return contact;
  }
}