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

  @Column({ nullable: true })
  imagePath: string;
  
  @ManyToOne(() => AgenceManager, (manager) => manager.voitures)
  agenceManager: AgenceManager;

  @ManyToOne(() => Agence, (agence) => agence.voitures, {
  onDelete: 'CASCADE'
  })
  agence: Agence;

  @OneToOne(() => Location, (location) => location.voiture)
  location: Location;

}                        
