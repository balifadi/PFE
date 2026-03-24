
import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Chambre } from './chambre.entity';
import { Reservation } from './reservation.entity';

@ChildEntity()
export class HotelManager extends User {  //تأكد من وجود export

  @OneToMany(() => Chambre, (chambre) => chambre.hotelManager)
  chambres: Chambre[];

  @OneToMany(() => Reservation, (reservation) => reservation.hotelManager)
  reservations: Reservation[];

}