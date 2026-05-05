import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Transform } from 'class-transformer';
import { Client } from './client.entity';
import { HotelManager } from './hotel-manager.entity';
import { Chambre } from './chambre.entity';
import { Facture } from './facture.entity';
import { Hotel } from './hotel.entity';

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

  @Column({ type: 'decimal', nullable: true, default: 0 })
  @Transform(({ value }) => `${value} DT`)
  montant: number;

  @ManyToOne(() => Client, (client) => client.reservations, {
  onDelete: 'SET NULL'
  }) 
  client: Client;

  @ManyToOne(() => HotelManager, (manager) => manager.reservations, {
    onDelete: 'SET NULL'
  })
  hotelManager: HotelManager;

  @OneToMany(() => Chambre, (chambre) => chambre.reservation, {onDelete: 'SET NULL'})
  chambres: Chambre[];

  @OneToOne(() => Facture, (facture) => facture.reservation, { nullable: true ,onDelete: 'SET NULL' })
  facture?: Facture;

  @ManyToOne(() => Hotel, { nullable: true, onDelete: 'SET NULL' })
  hotel: Hotel;

}  