import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private usersRepository: Repository<Package>,
  ) {}

  findAll(): Promise<Package[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Package | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async store(user: any): Promise<Package> {
    try {
      return this.usersRepository.save(user);
    } catch (error: any) {
      console.log('tt', error);
      throw new Error('Failed to create user');
    }
  }
}
