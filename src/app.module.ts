import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Entities
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { Client } from './entities/client.entity';
import { HotelManager } from './entities/hotel-manager.entity';
import { AgenceManager } from './entities/agence-manager.entity';
import { Zone } from './entities/zone.entity';
import { Hotel } from './entities/hotel.entity';
import { Chambre } from './entities/chambre.entity';
import { Reservation } from './entities/reservation.entity';
import { Voiture } from './entities/voiture.entity';
import { Location } from './entities/location.entity';
import { Facture } from './entities/facture.entity';
import { Agence } from './entities/agence.entity';
import { Avis } from './entities/avis.entity';
import { Notification } from './entities/notification.entity';
import { Favoris } from './entities/favoris.entity';
import { Contact } from './entities/contact.entity';


// Modules
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { HotelManagerModule } from './hotel-manager/hotel-manager.module';
import { AgenceManagerModule } from './agence-manager/agence-manager.module';
import { ZoneModule } from './zone/zone.module';
import { HotelModule } from './hotel/hotel.module';
import { ChambreModule } from './chambre/chambre.module';
import { ReservationModule } from './reservation/reservation.module';
import { VoitureModule } from './voiture/voiture.module';
import { LocationModule } from './location/location.module';
import { FactureModule } from './facture/facture.module';
import { AgenceModule } from './agence/agence.module';
import { AvisModule } from './avis/avis.module';
import { NotificationModule } from './notification/notification.module';
import { FavorisModule } from './favoris/favoris.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    // Event system
    EventEmitterModule.forRoot(),

    // Database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bd-tourisme',
      entities: [
        User,
        Admin,
        Client,
        HotelManager,
        AgenceManager,
        Zone,
        Hotel,
        Chambre,
        Reservation,
        Voiture,
        Location,
        Facture,
        Agence,
        Avis,
        Notification,
        Favoris,
        Contact
      ],
      synchronize: true,
    }),

    // Modules
    UserModule,
    AdminModule,
    ClientModule,
    HotelManagerModule,
    AgenceManagerModule,
    ZoneModule,
    HotelModule,
    ChambreModule,
    ReservationModule,
    VoitureModule,
    LocationModule,
    FactureModule,
    AgenceModule,
    AvisModule,
    NotificationModule,
    FavorisModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}