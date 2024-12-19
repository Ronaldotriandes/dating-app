import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySwipes } from './daily_swipe.entity';

@Injectable()
export class DailySwipeService {
  constructor(
    @InjectRepository(DailySwipes)
    private repository: Repository<DailySwipes>,
  ) {}

  findAll(): Promise<DailySwipes[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<DailySwipes | null> {
    return this.repository.findOneBy({ id });
  }

  findOneByIdDate(id: string): Promise<DailySwipes | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere('DATE(user.created_at) = DATE(:today)', { today })
      .getOne();
  }

  async update(id: string, updateData: Partial<DailySwipes>): Promise<any> {
    return this.repository.update(id, updateData);
  }
  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
  async store(context: any): Promise<DailySwipes> {
    return this.repository.save(context);
  }
}
