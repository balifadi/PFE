import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
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

  @Column({ type: 'text', nullable: true })
  adminReply: string;

  @Column({ default: false })
  isReplied: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Client, { nullable: true, onDelete: 'SET NULL' })
  client: Client;
}