import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { Reservation } from './reservation.entity';
import { Location } from './location.entity';

@Entity('factures')
export class Facture {

  @PrimaryGeneratedColumn()
  idfacture: number;

  @Column()
  mode_Paiement: string;

  @Column({ type: 'float', default: 0 })
  montant_Total: number;

  @Column({ type: 'date' })
  date_Facture: Date;

  @Column({ default: 'non payée' })
  statut: string;

  // Facture liée à un client (toujours obligatoire)
  @OneToOne(() => Client, (client) => client.facture)
  @JoinColumn()
  client: Client;

  // Facture liée à une réservation (اختيارية)
  @OneToOne(() => Reservation, (reservation) => reservation.facture, { nullable: true })
  @JoinColumn()
  reservation?: Reservation;

  // Facture liée à une location (اختيارية)
  @OneToOne(() => Location, (location) => location.facture, { nullable: true })
  @JoinColumn()
  location?: Location;
}