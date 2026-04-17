import { ChildEntity, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { Location } from './location.entity';
import { Facture } from './facture.entity';
import { Notification } from './notification.entity';
import { Avis } from './avis.entity';
import { Favoris } from './favoris.entity';

@ChildEntity('client') // ✅ valeur explicite
export class Client extends User {

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];

  @OneToMany(() => Location, (location) => location.client)
  locations: Location[];

  @OneToMany(() => Facture, (facture) => facture.client)
  factures: Facture[];   // ← tableau obligatoire avec OneToMany

  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];

  @OneToMany(() => Avis, (avis) => avis.client)
  avis: Avis[];

  @OneToMany(() => Favoris, (favoris) => favoris.client)
  favoris: Favoris[];
}