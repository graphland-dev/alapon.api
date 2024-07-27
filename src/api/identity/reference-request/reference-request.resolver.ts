import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import {
  ReferenceRequest,
  ReferenceRequestsWithPagination,
} from './entities/reference-request.entity';
import { ReferenceRequestService } from './reference-request.service';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import getGqlFields from '@/common/utils/gql-fields';
import { User } from '../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => ReferenceRequest)
export class ReferenceRequestResolver {
  constructor(
    private readonly referenceRequestService: ReferenceRequestService,
  ) {}

  @Query(() => ReferenceRequestsWithPagination, {
    name: 'identity__referenceRequests',
  })
  findAll(
    @Args('where', { nullable: true }) where: CommonPaginationOnlyDto,
    @Info() info: any,
  ) {
    try {
      return this.referenceRequestService.findAllWithPagination(
        where,
        getGqlFields(info, 'nodes'),
        [
          { path: 'requesterUser', model: User.name },
          { path: 'referenceUser', model: User.name },
        ],
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => ReferenceRequestsWithPagination, {
    name: 'identity__myReferenceApprovalRequests',
  })
  requests(
    @Args('where', { nullable: true }) where: CommonPaginationOnlyDto,
    @Info() info: any,
  ) {
    try {
      return this.referenceRequestService.findAllWithPagination(
        where,
        getGqlFields(info, 'nodes'),
        [
          { path: 'requesterUser', model: User.name },
          { path: 'referenceUser', model: User.name },
        ],
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
