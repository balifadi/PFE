import { ChildEntity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { Location } from './location.entity';
import { Facture } from './facture.entity';
import { Notification } from './notification.entity';
import { Avis } from './avis.entity';

@ChildEntity()
export class Client extends User {

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];

  @OneToMany(() => Location, (location) => location.client)
  locations: Location[];

  @OneToOne(() => Facture, (facture) => facture.client)
  facture: Facture;

  @OneToMany(() => Notification, (notification) => notification.client)
  notifications: Notification[];

  @OneToMany(() => Avis, (avis) => avis.client)
  avis: Avis[];
}