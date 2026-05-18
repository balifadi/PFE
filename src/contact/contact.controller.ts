import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Delete,
  Patch
} from '@nestjs/common';

import { ContactService } from './contact.service';

import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation
} from '@nestjs/swagger';

@ApiTags('Contacts')

@Controller('contact')

@UseGuards(JwtAuthGuard, RolesGuard)

@ApiBearerAuth()

export class ContactController {

  constructor(
    private readonly contactService: ContactService
  ) {}

  // ================= CREATE =================

  @Post()

  @Roles('client')

  @ApiOperation({
    summary: 'Envoyer un message'
  })

  create(
    @Body() dto: CreateContactDto,
    @Request() req: any,
  ) {

    return this.contactService.create(
      dto,
      req.user.iduser
    );
  }

  // ================= FIND ALL =================

  @Get()

  @Roles('admin')

  @ApiOperation({
    summary: 'Lister tous les messages'
  })

  findAll() {

    return this.contactService.findAll();
  }

  // ================= FIND ONE =================

  @Get(':id')

  @Roles('admin', 'client')

  @ApiOperation({
    summary: 'Obtenir un message par ID'
  })

  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {

    return this.contactService.findOne(id);
  }

  // ---- Admin : supprimer un message ----
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un message (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }

  // ---- Admin : répondre à un message ----
  @Patch(':id/reply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Répondre à un message (admin)' })
  reply(@Param('id', ParseIntPipe) id: number, @Body() dto: ReplyContactDto) {
    return this.contactService.reply(id, dto);
  }
}