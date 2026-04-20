import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
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

  // ✅ Un client peut avoir plusieurs factures
  @ManyToOne(() => Client, (client) => client.factures, {
  nullable: false,
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'clientId' })
client: Client;

  // ✅ Facture liée à une réservation (optionnelle)
  @OneToOne(() => Reservation, (reservation) => reservation.facture, { nullable: true, eager: false ,onDelete: 'SET NULL'})
  @JoinColumn({ name: 'reservationId' })
  reservation?: Reservation;

  // ✅ Facture liée à une location (optionnelle)
  @OneToOne(() => Location, (location) => location.facture, { nullable: true, eager: false ,onDelete: 'SET NULL'})
  @JoinColumn({ name: 'locationId' })
  location?: Location;
}