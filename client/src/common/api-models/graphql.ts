/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AddOrRemoveGroupModeratorInput = {
  groupHandle: Scalars['String']['input'];
  moderatorHandles: Array<Scalars['String']['input']>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  _id: Scalars['ID']['output'];
  chatRoom?: Maybe<ChatRoom>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<User>;
  messageType?: Maybe<ChatMessageType>;
  text?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ChatMessageType {
  SystemMessage = 'SYSTEM_MESSAGE',
  UserMessage = 'USER_MESSAGE'
}

export type ChatMessagesWithPagination = {
  __typename?: 'ChatMessagesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ChatMessage>>;
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  isNsfw: Scalars['Boolean']['output'];
  kickedUsers?: Maybe<Array<User>>;
  members?: Maybe<Array<User>>;
  moderators?: Maybe<Array<User>>;
  owner?: Maybe<User>;
  roomType: ChatRoomType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ChatRoomType {
  Group = 'GROUP',
  Private = 'PRIVATE'
}

export type ChatRoomsWithPagination = {
  __typename?: 'ChatRoomsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ChatRoom>>;
};

export type CommonFindDocumentDto = {
  and?: InputMaybe<Array<CommonFindDocumentDto>>;
  key?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<MatchOperator>;
  or?: InputMaybe<Array<CommonFindDocumentDto>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CommonMutationResponse = {
  __typename?: 'CommonMutationResponse';
  _id: Scalars['ID']['output'];
};

export type CommonPaginationDto = {
  filterOperator?: InputMaybe<Where_Operator>;
  filters?: InputMaybe<Array<CommonFindDocumentDto>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortType>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};

export type CommonPaginationOnlyDto = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortType>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};

export type CreateChatGroupInput = {
  handle: Scalars['String']['input'];
  isNsfw: Scalars['Boolean']['input'];
};

export type GroupMemberMutationInput = {
  groupHandle: Scalars['String']['input'];
  memberHandles: Array<Scalars['String']['input']>;
};

export type JoinInPersonInput = {
  userHandle: Scalars['String']['input'];
};

export type JoinOrLeaveGroupInput = {
  groupHandle: Scalars['String']['input'];
};

export type JoinUserInput = {
  handle: Scalars['String']['input'];
  pin: Scalars['String']['input'];
  referenceHandle: Scalars['String']['input'];
};

export type JoinUserResponse = {
  __typename?: 'JoinUserResponse';
  handle: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type LoginInput = {
  handle: Scalars['String']['input'];
  pin: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
};

export enum MatchOperator {
  ArrayItemsCountGte = 'arrayItemsCountGte',
  ArrayItemsCountLte = 'arrayItemsCountLte',
  Contains = 'contains',
  Eq = 'eq',
  Exists = 'exists',
  Gt = 'gt',
  Gte = 'gte',
  In = 'in',
  Lt = 'lt',
  Lte = 'lte',
  Ne = 'ne',
  Nin = 'nin'
}

export type Mutation = {
  __typename?: 'Mutation';
  chat__addGroupMembers: Scalars['Boolean']['output'];
  chat__addGroupModerators: Scalars['Boolean']['output'];
  /**
   * Create a new chat group
   *  🔐 Authenticated
   */
  chat__createChatGroup: CommonMutationResponse;
  /** Get a unique room handle */
  chat__getUniqueRoomHandle: Scalars['String']['output'];
  chat__joinGroup: Scalars['Boolean']['output'];
  chat__joinInPerson: CommonMutationResponse;
  chat__kickGroupMembers: Scalars['Boolean']['output'];
  chat__leaveGroup: Scalars['Boolean']['output'];
  chat__removeGroupModerators: Scalars['Boolean']['output'];
  /** 🔐 Autneticated */
  chat__roomMessages: ChatMessagesWithPagination;
  /**
   * Send message to chat room
   *  🔐 Autneticated
   */
  chat__sendMessageToRoom: CommonMutationResponse;
  chat__unKickGroupMembers: Scalars['Boolean']['output'];
  identity__join: JoinUserResponse;
  identity__login: LoginResponse;
  identity__resetPin: Scalars['Boolean']['output'];
};


export type MutationChat__AddGroupMembersArgs = {
  input: GroupMemberMutationInput;
};


export type MutationChat__AddGroupModeratorsArgs = {
  input: AddOrRemoveGroupModeratorInput;
};


export type MutationChat__CreateChatGroupArgs = {
  input: CreateChatGroupInput;
};


export type MutationChat__GetUniqueRoomHandleArgs = {
  handle: Scalars['String']['input'];
};


export type MutationChat__JoinGroupArgs = {
  input: JoinOrLeaveGroupInput;
};


export type MutationChat__JoinInPersonArgs = {
  input: JoinInPersonInput;
};


export type MutationChat__KickGroupMembersArgs = {
  input: GroupMemberMutationInput;
};


export type MutationChat__LeaveGroupArgs = {
  input: JoinOrLeaveGroupInput;
};


export type MutationChat__RemoveGroupModeratorsArgs = {
  input: AddOrRemoveGroupModeratorInput;
};


export type MutationChat__RoomMessagesArgs = {
  roomId: Scalars['String']['input'];
  where?: InputMaybe<CommonPaginationOnlyDto>;
};


export type MutationChat__SendMessageToRoomArgs = {
  input: SendMessageToRoomInput;
};


export type MutationChat__UnKickGroupMembersArgs = {
  input: GroupMemberMutationInput;
};


export type MutationIdentity__JoinArgs = {
  input: JoinUserInput;
};


export type MutationIdentity__LoginArgs = {
  input: LoginInput;
};


export type MutationIdentity__ResetPinArgs = {
  input: ResetPinInput;
};

export type PagniationMeta = {
  __typename?: 'PagniationMeta';
  currentPage: Scalars['Float']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  chat__myChatRooms: ChatRoomsWithPagination;
  identity__getUniqueHandle: Scalars['String']['output'];
  identity__myReferenceApprovalRequests: ReferenceRequestsWithPagination;
  identity__referenceRequests: ReferenceRequestsWithPagination;
  identity__users: UsersWithPagination;
  ping: Scalars['String']['output'];
};


export type QueryChat__MyChatRoomsArgs = {
  where?: InputMaybe<CommonPaginationOnlyDto>;
};


export type QueryIdentity__GetUniqueHandleArgs = {
  handle: Scalars['String']['input'];
};


export type QueryIdentity__MyReferenceApprovalRequestsArgs = {
  where?: InputMaybe<CommonPaginationOnlyDto>;
};


export type QueryIdentity__ReferenceRequestsArgs = {
  where?: InputMaybe<CommonPaginationOnlyDto>;
};


export type QueryIdentity__UsersArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};

export type ReferenceRequest = {
  __typename?: 'ReferenceRequest';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  referenceUser: User;
  requesterUser: User;
  status: ReferenceRequestStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ReferenceRequestStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ReferenceRequestsWithPagination = {
  __typename?: 'ReferenceRequestsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ReferenceRequest>>;
};

export type ResetPinInput = {
  handle: Scalars['String']['input'];
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type SendMessageToRoomInput = {
  roomId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  accountStatus?: Maybe<UserAccountStatus>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  handle: Scalars['String']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  referenceHandle?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum UserAccountStatus {
  Active = 'ACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type UserReference = {
  __typename?: 'UserReference';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  referenceId?: Maybe<Scalars['ID']['output']>;
};

export type UsersWithPagination = {
  __typename?: 'UsersWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<User>>;
};

export enum Where_Operator {
  And = 'and',
  Or = 'or'
}
