import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {

  @PrimaryGeneratedColumn()
  iduser: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  telephone: string;

   @Column()
  role: string;

}