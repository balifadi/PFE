import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';
import { Client } from './client.entity';

@Entity()
export class Notification {

  @PrimaryGeneratedColumn()
  idnotification: number;

  @Column()
  type: string; // ex: "zone", "hotel", "agence", "reservation", "location"

  @Column()
  message: string;

  @Column({ type: 'date' })
  date_Envoi: Date;

  @ManyToOne(() => Admin, (admin) => admin.notifications, { nullable: true })
  admin: Admin;

  @ManyToOne(() => Client, (client) => client.notifications, { nullable: true })
  client: Client;

}  