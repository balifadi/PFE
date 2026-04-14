import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Chambre } from './chambre.entity';
import { Reservation } from './reservation.entity';
import { Hotel } from './hotel.entity';

@ChildEntity('hotel-manager') // ✅ valeur explicite
export class HotelManager extends User {

  @OneToMany(() => Chambre, (chambre) => chambre.hotelManager)
  chambres: Chambre[];

  @OneToMany(() => Reservation, (reservation) => reservation.hotelManager)
  reservations: Reservation[];

  @OneToMany(() => Hotel, (hotel) => hotel.hotelManager)
  hotels: Hotel[];
}