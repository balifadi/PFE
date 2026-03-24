import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { HotelManager } from './hotel-manager.entity';
import { Hotel } from './hotel.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Chambre {

  @PrimaryGeneratedColumn()
  idchambre: number;

  @Column()
  numero: number;

  @Column()
  capacite: number;

  @Column()
  etat: string;

  @Column('decimal')
  prix_Nuit: number;

  @ManyToOne(() => HotelManager, (manager) => manager.chambres)
  hotelManager: HotelManager;

  @ManyToOne(() => Hotel, (hotel) => hotel.chambres)
  hotel: Hotel;

  @ManyToOne(() => Reservation, (reservation) => reservation.chambres)
  reservation: Reservation;

}