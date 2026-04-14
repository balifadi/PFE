import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Voiture } from './voiture.entity';
import { Location } from './location.entity';
import { Agence } from './agence.entity';

@ChildEntity('agence-manager') // ✅ valeur explicite
export class AgenceManager extends User {

  @OneToMany(() => Voiture, (voiture) => voiture.agenceManager)
  voitures: Voiture[];

  @OneToMany(() => Location, (location) => location.agenceManager)
  locations: Location[];

  @OneToMany(() => Agence, (agence) => agence.agenceManager)
  agences: Agence[];
}