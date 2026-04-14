import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Zone } from './zone.entity';
import { Hotel } from './hotel.entity';
import { Agence } from './agence.entity';
import { Notification } from './notification.entity';
import { Avis } from './avis.entity';

@ChildEntity('admin') // ✅ valeur explicite
export class Admin extends User {

  @OneToMany(() => Zone, (zone) => zone.admin)
  zones: Zone[];

  @OneToMany(() => Hotel, (hotel) => hotel.admin)
  hotels: Hotel[];

  @OneToMany(() => Agence, (agence) => agence.admin)
  agences: Agence[];

  @OneToMany(() => Notification, (notification) => notification.admin)
  notifications: Notification[];

  @OneToMany(() => Avis, (avis) => avis.admin)
  avis: Avis[];
}