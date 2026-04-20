import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { AgenceManager } from './agence-manager.entity';
import { Voiture } from './voiture.entity';
import { Facture } from './facture.entity';

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

  @ManyToOne(() => Client, (client) => client.locations,{
    onDelete: 'SET NULL'
  })
  client: Client;

  @ManyToOne(() => AgenceManager, (manager) => manager.locations,{
    onDelete: 'SET NULL'
  })
  agenceManager: AgenceManager;

  @OneToOne(() => Voiture, (voiture) => voiture.location,{ onDelete: 'SET NULL'})
  @JoinColumn()
  voiture: Voiture;

  @OneToOne(() => Facture, (facture) => facture.location, { nullable: true , onDelete: 'SET NULL'})
  facture?: Facture;


}