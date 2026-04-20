import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Contact {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  telephone: string;

  @Column()
  email: string;

  @Column('text')
  message: string;

  @ManyToOne(() => Client, (client) => client.contacts, {
    onDelete: 'CASCADE'
  })
  client: Client;
}