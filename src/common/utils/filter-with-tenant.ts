import {
  CommonFindDocumentDto,
  MatchOperator,
} from '../dto/CommonFindDocumentDto';
import {
  CommonPaginationDto,
  WHERE_OPERATOR,
} from '../dto/CommonPaginationDto';

export const filterWithTenant = (
  where: CommonPaginationDto,
  tenant: string,
) => {
  if (!tenant) {
    return where;
  }
  where.filters = [
    {
      key: 'tenant',
      operator: MatchOperator.eq,
      value: tenant,
    },
    ...(where.filters || []),
  ];
  where.filterOperator = WHERE_OPERATOR.and;
  return where;
};

export const filterWithTenantForFindOne = (
  where: CommonFindDocumentDto,
  tenant: string,
) => {
  if (!tenant) {
    return where;
  }

  return {
    and: [
      {
        key: 'tenant',
        operator: MatchOperator.eq,
        value: tenant,
      },
      where,
    ],
  };
};
