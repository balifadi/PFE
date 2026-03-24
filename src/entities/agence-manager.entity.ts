import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Voiture } from './voiture.entity';
import { Location } from './location.entity';

@ChildEntity()
export class AgenceManager extends User {

  @OneToMany(() => Voiture, (voiture) => voiture.agenceManager)
  voitures: Voiture[];

  @OneToMany(() => Location, (location) => location.agenceManager)
  locations: Location[];
}