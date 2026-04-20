import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { Admin } from './admin.entity';
import { Chambre } from './chambre.entity';
import { HotelManager } from './hotel-manager.entity'; // ✅ مهم

@Entity()
export class Hotel {

  @PrimaryGeneratedColumn()
  idhotel: number;

  @Column()
  nom: string;

  @Column()
  ville: string;

  @Column()
  nb_Etoiles: number;

  @Column({ default: 0 })
  nb_chambres: number;

  @Column()
  telephone: string;

  @Column()
  imagePath: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @ManyToOne(() => Admin, (admin) => admin.hotels)
  admin: Admin;


  @ManyToOne(() => HotelManager, (manager) => manager.hotels, { nullable: true,onDelete: 'SET NULL' })
  hotelManager: HotelManager;

  @OneToMany(() => Chambre, (chambre) => chambre.hotel, {
    onDelete: 'SET NULL'
  })
  chambres: Chambre[];
} 