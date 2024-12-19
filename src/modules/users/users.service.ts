import { BadRequestException, Injectable } from '@nestjs/common';
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
  queryAll = async () => {
    const token = this.globalStore.getterTokenData();
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust to GMT+7

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
      });
    return data;
  };
  async findAll(): Promise<User[]> {
    const token = this.globalStore.getterTokenData();
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust to GMT+7
    const data = await this.queryAll();
    const getSubsc = await this.subscriptionService.findAll({
      id: token.id,
      status: 'active',
    });

    if (
      getSubsc.length > 0 &&
      getSubsc.find((x) => x.package === 'verified_badge')
    ) {
      data.orderBy('user.is_verified ', 'DESC');
    } else {
      data
        .andWhere('user.is_verified = :verify', { verify: false })
        .orderBy('RANDOM()');
    }
    if (
      getSubsc.length === 0 ||
      !getSubsc.find((x) => x.package === 'unlimited_swipes')
    ) {
      data.take(10);
    }
    return data.getMany();
  }
  async findOne(id: string): Promise<any> {
    const datas = await this.queryAll();
    const data = await datas.getRawMany();
    if (!data.find((x) => x.id === id)) {
      throw new BadRequestException('you already swipe this user today');
    }
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
      const getCountDailySwipe = await this.dailySwipeService.findOneByIdDate(
        token.id,
      );

      if (
        !unlimitedPackage &&
        getCountDailySwipe &&
        getCountDailySwipe.swipe_count >= 10
      ) {
        throw new BadRequestException(
          'You have reached the maximum swipe limit for today.',
        );
      }
      const result = await this.swipeService.store(data);
      if (!getCountDailySwipe) {
        await this.dailySwipeService.store({
          user_id: token.id,
          swipe_count: 1,
        });
      } else {
        await this.dailySwipeService.update(getCountDailySwipe.id, {
          swipe_count: getCountDailySwipe.swipe_count + 1,
        });
      }
      return result;
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }

  async store(user: any): Promise<User> {
    try {
      return this.usersRepository.save(user);
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }
}
