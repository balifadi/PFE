import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Client } from './client.entity';
import { HotelManager } from './hotel-manager.entity';
import { Chambre } from './chambre.entity';
import { Facture } from './facture.entity';

@Entity()
export class Reservation {

  @PrimaryGeneratedColumn()
  idreservation: number;

  @Column({ type: 'date' })
  date_debut: Date;

  @Column({ type: 'date' })
  date_fin: Date;

  @Column()
  statut: string;

  @Column({ type: 'float', default: 0 })
  montant_reservation: number;

  @ManyToOne(() => Client, (client) => client.reservations)
  client: Client;

  @ManyToOne(() => HotelManager, (manager) => manager.reservations)
  hotelManager: HotelManager;

  @OneToMany(() => Chambre, (chambre) => chambre.reservation)
  chambres: Chambre[];

  @OneToOne(() => Facture, (facture) => facture.reservation)
  facture: Facture;

}