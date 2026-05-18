import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';

@Injectable()
export class ContactService {

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateContactDto, clientId?: number) {
    const contact = this.contactRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      telephone: dto.telephone,
      email: dto.email,
      message: dto.message,
      ...(clientId ? { client: { iduser: clientId } } : {}),
    });
    return this.contactRepo.save(contact);
  }

  // ================= FIND ALL =================
  async findAll() {
    return this.contactRepo.find({
      relations: ['client'],
      order: { id: 'DESC' },
    });
  }

  // ================= FIND ONE =================
  async findOne(id: number) {
    const contact = await this.contactRepo.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!contact) throw new NotFoundException('Message non trouvé');
    return contact;
  }

  // ================= DELETE =================
  async remove(id: number) {
    const contact = await this.findOne(id);
    await this.contactRepo.remove(contact);
    return { message: 'Message supprimé avec succès' };
  }

  // ================= REPLY =================
  async reply(id: number, dto: ReplyContactDto) {
    const contact = await this.findOne(id);
    contact.adminReply = dto.adminReply;
    contact.isReplied = true;
    return this.contactRepo.save(contact);
  }
}