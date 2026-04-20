import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  idzone: number;

  @Column()
  nom: string;

  @Column()
  ville: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @ManyToOne(() => Admin, (admin) => admin.zones, {onDelete: 'SET NULL'})
  admin: Admin;
}