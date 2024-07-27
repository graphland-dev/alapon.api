import { CommonFindDocumentDto } from '../dto/CommonFindDocumentDto';
import { CommonPaginationDto } from '../dto/CommonPaginationDto';

export const filterWithPreCondition = (
  where: CommonPaginationDto,
  preCondition: CommonFindDocumentDto,
) => {
  if (where.filters) {
    where.filters.push(preCondition);
  } else {
    where.filters = [preCondition];
  }
  return where;
};

export const findWithPreCondition = (
  where: CommonFindDocumentDto,
  preCondition: CommonFindDocumentDto,
) => {
  return { and: [where, preCondition] };
};
