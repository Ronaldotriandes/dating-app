import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySwipeService } from './daily_swipes.service';
import { DailySwipes } from './daily_swipe.entity';
import { User } from '../users/user.entity';

describe('DailySwipeService', () => {
  let service: DailySwipeService;
  let repository: Repository<DailySwipes>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailySwipeService,
        {
          provide: getRepositoryToken(DailySwipes),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<DailySwipeService>(DailySwipeService);
    repository = module.get<Repository<DailySwipes>>(
      getRepositoryToken(DailySwipes),
    );
  });

  describe('findAll', () => {
    it('should return an array of daily swipes', async () => {
      const expectedResult: DailySwipes[] = [
        {
          id: '1',
          user_id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29',
          swipe_count: 5,
          swipe_date: new Date(),
          created_at: new Date(),
          user: { id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29' } as User,
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(result).toBe(expectedResult);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single daily swipe record', async () => {
      const expectedResult: DailySwipes = {
        id: '1',
        user_id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29',
        swipe_count: 5,
        swipe_date: new Date(),
        created_at: new Date(),
        user: { id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29' } as User,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(expectedResult);

      const result = await service.findOne('1');
      expect(result).toBe(expectedResult);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null if daily swipe record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('findOneByIdDate', () => {
    it('should handle invalid user id', async () => {
      const queryBuilder = repository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(null);

      const result = await service.findOneByIdDate('invalid-id');
      expect(result).toBeUndefined();
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should handle records from different dates', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // const oldRecord: DailySwipes = {
      //   id: '1',
      //   user_id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29',
      //   swipe_count: 5,
      //   swipe_date: yesterday,
      //   created_at: yesterday,
      //   user: { id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29' } as User,
      // };

      const queryBuilder = repository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(null);

      const result = await service.findOneByIdDate('1');
      expect(result).toBeUndefined();
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should handle timezone edge cases', async () => {
      const nearMidnight = new Date();
      nearMidnight.setHours(23, 59, 59, 999);

      const record: DailySwipes = {
        id: '1',
        user_id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29',
        swipe_count: 5,
        swipe_date: nearMidnight,
        created_at: nearMidnight,
        user: { id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29' } as User,
      };

      const queryBuilder = repository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(record);

      const result = await service.findOneByIdDate('321');
      expect(result);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('store', () => {
    it('should create a new daily swipe record', async () => {
      const newRecord = { user_id: '1', swipes_count: 1 };
      const expectedResult: DailySwipes = {
        id: '1',
        user_id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29',
        swipe_count: 5,
        swipe_date: new Date(),
        created_at: new Date(),
        user: { id: 'bf128a15-b2f5-4f9e-90af-14e5dee11b29' } as User,
      };
      jest.spyOn(repository, 'save').mockResolvedValue(expectedResult);

      const result = await service.store(newRecord);
      expect(result).toBe(expectedResult);
      expect(repository.save).toHaveBeenCalledWith(newRecord);
    });
  });
});
