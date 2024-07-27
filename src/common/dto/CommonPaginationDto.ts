import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CommonFindDocumentDto } from './CommonFindDocumentDto';

export enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

export enum WHERE_OPERATOR {
  and = 'and',
  or = 'or',
}

registerEnumType(WHERE_OPERATOR, {
  name: 'WHERE_OPERATOR',
});

registerEnumType(SortType, {
  name: 'SortType',
});

@InputType()
export class CommonPaginationDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  page: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit: number;

  @Field(() => SortType, { nullable: true })
  @IsOptional()
  sort?: SortType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => [CommonFindDocumentDto], { nullable: true })
  @IsOptional()
  filters?: CommonFindDocumentDto[];

  @Field(() => WHERE_OPERATOR, { nullable: true })
  @IsOptional()
  filterOperator?: WHERE_OPERATOR;
}

@InputType()
export class CommonPaginationOnlyDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  page: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit: number;

  @Field(() => SortType, { nullable: true })
  @IsOptional()
  sort?: SortType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;
}
