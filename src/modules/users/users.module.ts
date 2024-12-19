import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { SwipeModule } from '../swipes/swipes.module';
import { DailySwipeModule } from '../daily_swipe/daily_swipes.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import { GlobalStoreModule } from 'src/setup/global-store.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SwipeModule,
    DailySwipeModule,
    SubscriptionModule,
    GlobalStoreModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
