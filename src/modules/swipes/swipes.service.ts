import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swipe } from './swipe.entity';
import { GlobalStoreService } from '../../setup/global-store.service';

@Injectable()
export class SwipeService {
  constructor(
    @InjectRepository(Swipe)
    private usersRepository: Repository<Swipe>,
    private globalService: GlobalStoreService,
  ) {}

  findAll(): Promise<Swipe[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Swipe | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async store(user: any): Promise<Swipe> {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust to GMT+7

    try {
      const sameData = await this.usersRepository
        .createQueryBuilder('swipe')
        .where('swipe.user_id = :userId', { userId: user.user_id })
        .andWhere('swipe.user_id_target = :targetUserId', {
          targetUserId: user.user_id_target,
        })
        .andWhere('DATE(swipe.created_at) = DATE(:date)', { date: new Date() })
        .getMany();
      if (sameData.length > 0) {
        throw new BadRequestException(
          'You have already swiped this user today',
        );
      }
      return this.usersRepository.save(user);
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }
}
