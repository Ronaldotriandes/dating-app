import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageService } from './packages.service';
import { Package } from './package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackageService],
})
export class PackageModule {}
