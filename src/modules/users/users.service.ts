import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GlobalStoreService } from '../../setup/global-store.service';
import { SwipeService } from '../swipes/swipes.service';
import { Swipe } from '../swipes/swipe.entity';
import { DailySwipeService } from '../daily_swipe/daily_swipes.service';
import { SubscriptionService } from '../subscriptions/subscription.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private swipeService: SwipeService,
    private dailySwipeService: DailySwipeService,
    private subscriptionService: SubscriptionService,
    private globalStore: GlobalStoreService,
  ) {}

  async findAll(): Promise<User[]> {
    const token = this.globalStore.getterTokenData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getSubsc = await this.subscriptionService.findAll({
      id: token.id,
      status: 'active',
    });
    const data = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fullname',
        'user.email',
        'user.gender',
        'user.profile_picture',
        'user.bio',
      ])
      .where('user.id != :currentUserId', { currentUserId: token.id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('swipe.user_id_target')
          .from(Swipe, 'swipe')
          .where('swipe.user_id = :currentUserId', { currentUserId: token.id })
          .andWhere('DATE(swipe.created_at) = DATE(:today)', { today })
          .getQuery();
        return 'user.id NOT IN ' + subQuery;
      })
      .orderBy('RANDOM()');
    if (
      getSubsc.length > 0 &&
      getSubsc.find((x) => x.package === 'verified_badge')
    ) {
      data.andWhere('user.is_verified = :verify', { verify: true });
    } else {
      data.andWhere('user.is_verified = :verify', { verify: false });
    }

    if (
      getSubsc.length === 0 ||
      !getSubsc.find((x) => x.package === 'unlimited_swipes')
    ) {
      data.take(10);
    }
    return data.getMany();
  }
  findOne(id: string): Promise<any> {
    return this.usersRepository.findOneBy({ id });
  }

  async swipeUser(id: string, swipeType: string): Promise<any> {
    const token = this.globalStore.getterTokenData();
    try {
      const data = {
        user_id: token.id,
        user_id_target: id,
        swipe_type: swipeType,
      };
      const getSubsc = await this.subscriptionService.findAll({
        id: token.id,
        status: 'active',
      });
      const unlimitedPackage = getSubsc.find(
        (x) => x.package === 'unlimited_swipes',
      );
      const getCountDailySwipe =
        await this.dailySwipeService.findOneByIdDate(id);

      if (
        !unlimitedPackage &&
        getCountDailySwipe &&
        getCountDailySwipe.swipe_count > 10
      ) {
        throw new Error('You have reached the maximum swipe limit for today.');
      }
      const result = await this.swipeService.store(data);
      if (!getCountDailySwipe) {
        await this.dailySwipeService.store({
          user_id: id,
          swipe_count: 1,
        });
      } else {
        await this.dailySwipeService.update(getCountDailySwipe.id, {
          swipe_count: getCountDailySwipe.swipe_count + 1,
        });
      }
      return result;
    } catch (error: any) {
      console.log('error', error);
      throw new Error(error);
    }
  }

  async store(user: any): Promise<User> {
    try {
      return this.usersRepository.save(user);
    } catch (error: any) {
      console.log('tt', error);
      throw new Error('Failed to create user');
    }
  }
}
