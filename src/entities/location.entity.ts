import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { Client } from './client.entity';
import { AgenceManager } from './agence-manager.entity';
import { Voiture } from './voiture.entity';
import { Facture } from './facture.entity';
import { Agence } from './agence.entity';

@Entity()
export class Location {

  @PrimaryGeneratedColumn()
  idlocation: number;

  @Column({ type: 'date' })
  date_debut: Date;

  @Column({ type: 'date' })
  date_fin: Date;

  @Column()
  statut: string;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  @Transform(({ value }) => `${value} DT`)
  montant: number;

  @ManyToOne(() => Client, (client) => client.locations,{
    onDelete: 'SET NULL'
  })
  client: Client;

  @ManyToOne(() => AgenceManager, (manager) => manager.locations)
  agenceManager: AgenceManager;

  @OneToOne(() => Voiture, (voiture) => voiture.location)
  @JoinColumn()
  voiture: Voiture;

  @OneToOne(() => Facture, (facture) => facture.location)
  facture: Facture;

  @ManyToOne(() => Agence, { nullable: true, onDelete: 'SET NULL' })
  agence: Agence;

}
