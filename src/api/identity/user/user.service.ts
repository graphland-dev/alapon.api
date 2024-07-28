import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends BaseDatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    public readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
}
