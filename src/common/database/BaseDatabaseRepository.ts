import mongoose, { AnyKeys, FilterQuery, Model } from 'mongoose';
import { CommonFindDocumentDto } from '@/common/dto/CommonFindDocumentDto';
import {
  CommonPaginationDto,
  SortType,
} from '@/common/dto/CommonPaginationDto';
import {
  mongodbFindObjectBuilder,
  mongoDbMultiFilterBuilder,
} from '@/common/database/filterBuilder';
import { AppPaginationResponseDto } from '@/common/dto/AppPaginationResponseDto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { UserReference } from '../common-models/user-reference.model';
import { ResourceCommitHistoryReference } from '../common-models/resource-commit-history.model';

export abstract class BaseDatabaseRepository<MODEL_TYPE> {
  protected keyMapper: { [key: string]: any } = {}; // {userId: 'user'}
  protected constructor(
    protected readonly model: Model<MODEL_TYPE>,
    keyMapper?: any,
  ) {
    this.keyMapper = keyMapper;
  }

  async findAllWithPagination(
    payload: CommonPaginationDto,
    fields?: string[],
    populations?: mongoose.PopulateOptions[],
    preCondition?: FilterQuery<MODEL_TYPE>,
  ) {
    const { page = 1, limit = 10 } = payload;

    let find = mongoDbMultiFilterBuilder({
      filters: payload.filters,
      multiFilterOperator: payload.filterOperator,
    });

    if (preCondition) {
      find = { $and: [find, preCondition] };
    }

    console.log('findAllWithPagination', JSON.stringify(find));

    const cursor = this.model.find(find);

    populations?.forEach((populate) => {
      if (fields.length) {
        if (fields.includes(populate.path)) {
          cursor.populate(populate);
        }
      } else {
        cursor.populate(populate);
      }
    });

    const count = await this.model.countDocuments(find);
    const skip = (page - 1) * limit;

    if (fields?.length) cursor.select(fields?.join(' '));

    const sortType = payload?.sort || SortType.DESC;
    cursor.sort({
      [payload?.sortBy || 'createdAt']: sortType === SortType.DESC ? -1 : 1,
    });

    if (limit !== -1) {
      cursor.skip(skip).limit(limit);
    }

    const data = await cursor.exec();

    return new AppPaginationResponseDto(data, {
      currentPage: page,
      hasNextPage: limit === -1 ? false : page * limit < count,
      totalCount: count,
      totalPages: limit === -1 ? 1 : Math.ceil(count / limit),
    });
  }

  findOne(
    payload?: CommonFindDocumentDto,
    fields?: string[],
    populations?: mongoose.PopulateOptions[],
    preCondition?: FilterQuery<MODEL_TYPE>,
  ) {
    let find = mongodbFindObjectBuilder(payload);

    if (preCondition) {
      find = { $and: [find, preCondition] };
    }

    const cursor = this.model.findOne(find as any);

    populations?.forEach((populate) => {
      if (fields.includes(populate.path)) {
        cursor.populate(populate);
      }
    });

    return cursor.select(fields?.join(' '));
  }

  findMany(
    payload?: CommonFindDocumentDto,
    fields?: string[],
    populations?: mongoose.PopulateOptions[],
  ) {
    const find = mongodbFindObjectBuilder(payload);
    const cursor = this.model.find(find as any);

    populations?.forEach((populate) => {
      cursor.populate(populate);
    });

    return cursor.select(fields?.join(' '));
  }

  createOne(
    body: { [key: string]: any } | AnyKeys<MODEL_TYPE>,
    commiterUser?: UserReference,
  ) {
    for (const key in this.keyMapper) {
      if (body[key]) {
        const mappedKey = this.keyMapper[key];
        body[mappedKey] = body[key];
      }
    }

    if (commiterUser) {
      body['commits'] = [
        new ResourceCommitHistoryReference(commiterUser, 'create'),
      ];
    } else {
      body['commits'] = [
        new ResourceCommitHistoryReference(
          {
            email: 'system@minipage.app',
            name: 'system',
            referenceId: '00000000-0000-0000-0000-000000000000',
          },
          'create',
        ),
      ];
    }

    return this.model.create(body);
  }

  createMany(
    body: { [key: string]: any }[] | AnyKeys<MODEL_TYPE>[],
    commiterUser?: UserReference,
  ) {
    for (const key in this.keyMapper) {
      if (body[key]) {
        const mappedKey = this.keyMapper[key];
        body[mappedKey] = body[key];
      }
    }

    if (commiterUser) {
      body.forEach((item) => {
        item['commits'] = [
          new ResourceCommitHistoryReference(commiterUser, 'create'),
        ];
      });
    }

    return this.model.create(body);
  }

  async updateOne(
    where: CommonFindDocumentDto,
    body: { [key: string]: any }[] | mongoose.UpdateQuery<MODEL_TYPE>,
    authUser?: IAuthUser,
    commiterUser?: UserReference,
  ) {
    const find: any = mongodbFindObjectBuilder(where);
    console.log(find);
    const doc = await this.model.findOne(find);
    if (!doc)
      throw new NotFoundException('Resource not found or unauthorized access');

    if (authUser && !this.hasMutationPermission(authUser, doc))
      throw new UnauthorizedException('You do not have permission');

    for (const key in this.keyMapper) {
      if (body[key]) {
        const mappedKey = this.keyMapper[key];
        body[mappedKey] = body[key];
      }
    }

    const _doc = await this.model.findOne(find);

    if (!_doc) throw new NotFoundException('Resource not found');

    if (commiterUser) {
      body['commits'] = [
        ..._doc['commits'],
        new ResourceCommitHistoryReference(commiterUser, 'update'),
      ];
    }

    const updated = await this.model.updateOne(find, body, { new: true });
    const updatedDoc = await this.model.findOne(find);

    return {
      ...updated,
      doc: updatedDoc,
    };
  }

  async deleteOne(where: CommonFindDocumentDto, authUser?: IAuthUser) {
    const find: any = mongodbFindObjectBuilder(where);
    const doc = await this.model.findOne(find);
    if (!doc) throw new NotFoundException();

    if (authUser && !this.hasMutationPermission(authUser, doc))
      throw new UnauthorizedException('You do not have permission');

    const deletedResponse = await this.model.deleteOne(find);
    return {
      ...deletedResponse,
      doc,
    };
  }

  async deleteMany(payload?: CommonFindDocumentDto) {
    const find: any = mongodbFindObjectBuilder(payload);
    const deletedResponse = await this.model.deleteMany(find);
    return {
      ...deletedResponse,
    };
  }

  hasMutationPermission(authUser: IAuthUser, document: any) {
    if (!document?.['user']) return true;
    // if (authUser.roles?.includes('super_admin')) return true;
    if (document?.user.equals(authUser?.sub)) return true;

    return false;
  }
}
