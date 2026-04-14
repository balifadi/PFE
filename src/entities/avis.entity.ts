import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';
import { Client } from './client.entity';

@Entity()
export class Avis {

  @PrimaryGeneratedColumn()
  idavis: number;

  @Column()
  type: string; // "zone", "hotel", "agence"

  @Column('decimal')
  note: number;

  @Column({ nullable: true })
  commentaire: string;

  @Column({ type: 'date' })
  date_Avis: Date;

  @Column()
  targetId: number;
  @ManyToOne(() => Admin, (admin) => admin.avis)
  admin: Admin;

  @ManyToOne(() => Client, (client) => client.avis)
  client: Client;
}