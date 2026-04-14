import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../entities/client.entity';

// ✅ Enum propre (BEST PRACTICE)
export enum FavorisType {
  HOTEL = 'hotel',
  AGENCE = 'agence',
  ZONE = 'zone',
}

@Entity()
export class Favoris {

  @PrimaryGeneratedColumn()
  id: number;

  // ✅ Enum utilisé dans la base de données
  @Column({
    type: 'enum',
    enum: FavorisType,
  })
  type: FavorisType;

  @Column()
  targetId: number;

  @ManyToOne(() => Client, (client) => client.favoris, { onDelete: 'CASCADE' })
  client: Client;
}