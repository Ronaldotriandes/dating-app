import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { GlobalStoreService } from '../../setup/global-store.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private usersRepository: Repository<Subscription>,
    private globalSerice: GlobalStoreService,
  ) {}

  findAll(query: any = {}): Promise<Subscription[]> {
    return this.usersRepository.find(query);
  }

  findOne(id: string): Promise<Subscription | null> {
    return this.usersRepository.findOneBy({ id, status: 'active' });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async store(user: any): Promise<Subscription> {
    const token = this.globalSerice.getterTokenData();
    try {
      const start_date = new Date();
      const end_date = new Date(start_date);
      end_date.setDate(start_date.getDate() + 60);
      const data = {
        ...user,
        user_id: token.id,
        start_date,
        end_date,
        status: 'active',
      };
      return this.usersRepository.save(data);
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }
}
