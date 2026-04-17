import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
  @PrimaryGeneratedColumn()
  iduser: number;

  @Column()
  nom: string;

  // ✅ AJOUT
  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // ✅ AJOUT
  @Column()
  telephone: string;

  @Column({ name: 'role' })
  role: string;
}