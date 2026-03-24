import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Admin } from './admin.entity';
import { Voiture } from './voiture.entity';

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

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @ManyToOne(() => Admin, (admin) => admin.agences)
  admin: Admin;

  @OneToMany(() => Voiture, (voiture) => voiture.agence)
  voitures: Voiture[];

}