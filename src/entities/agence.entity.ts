import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Admin } from './admin.entity';
import { Voiture } from './voiture.entity';
import { AgenceManager } from './agence-manager.entity'; // ✅ مهم

@Entity()
export class Agence {

  @PrimaryGeneratedColumn()
  idagence: number;

  @Column()
  nom: string;

  @Column()
  ville: string;

  @Column()
  telephone: string;

  @Column({ default: 0 })
  nb_voitures: number;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @ManyToOne(() => Admin, (admin) => admin.agences,{onDelete: 'SET NULL'})
  admin: Admin;

  @ManyToOne(() => AgenceManager, (manager) => manager.agences, { nullable: true, onDelete: 'SET NULL'})
  agenceManager: AgenceManager;

  @OneToMany(() => Voiture, (voiture) => voiture.agence,{onDelete: 'SET NULL'})
  voitures: Voiture[];
}                        