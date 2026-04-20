import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { AgenceManager } from './agence-manager.entity';
import { Agence } from './agence.entity';
import { Location } from './location.entity';

@Entity()
export class Voiture {

  @PrimaryGeneratedColumn()
  idvoiture: number;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column()
  immatriculation: string;

  @Column()
  etat: string;

  @Column({ type: 'decimal' })
  prix_Jour: number;
  
  @ManyToOne(() => AgenceManager, (manager) => manager.voitures, {onDelete: 'SET NULL'})
  agenceManager: AgenceManager;

  @ManyToOne(() => Agence, (agence) => agence.voitures, {onDelete: 'SET NULL'})
  agence: Agence;

  @OneToOne(() => Location, (location) => location.voiture, {onDelete: 'SET NULL'})
  location: Location;

}                        