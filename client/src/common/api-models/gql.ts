/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GET_USER_QUERIES {\n    identity__me {\n      _id\n      handle\n      referenceHandle\n      accountStatus\n      lastLoginAt\n      createdAt\n      updatedAt\n    }\n  }\n": types.Get_User_QueriesDocument,
    "\n  mutation Identity__resetPin($input: ResetPinInput!) {\n    identity__resetPin(input: $input)\n  }\n": types.Identity__ResetPinDocument,
    "\n  query Chat__roomMessages($roomId: String!, $where: CommonPaginationOnlyDto) {\n    chat__roomMessages(roomId: $roomId, where: $where) {\n      meta {\n        totalCount\n        hasNextPage\n      }\n      nodes {\n        _id\n        messageType\n        text\n        createdAt\n        updatedAt\n        createdBy {\n          _id\n          handle\n        }\n        chatRoom {\n          _id\n          handle\n        }\n      }\n    }\n  }\n": types.Chat__RoomMessagesDocument,
    "\n  query Chat__myChatRooms($where: CommonPaginationOnlyDto) {\n    chat__myChatRooms(where: $where) {\n      nodes {\n        _id\n        handle\n        members {\n          handle\n        }\n        lastMessage {\n          text\n        }\n        lastMessageSender {\n          handle\n        }\n        isNsfw\n        roomType\n      }\n    }\n  }\n": types.Chat__MyChatRoomsDocument,
    "\n  mutation Chat__createChatGroup($input: CreateChatGroupInput!) {\n    chat__createChatGroup(input: $input) {\n      _id\n    }\n  }\n": types.Chat__CreateChatGroupDocument,
    "\n  mutation Chat__getUniqueGroupHandle($handle: String!) {\n    chat__getUniqueRoomHandle(handle: $handle)\n  }\n": types.Chat__GetUniqueGroupHandleDocument,
    "\n  mutation Chat__joinGroup($input: JoinOrLeaveGroupInput!) {\n    chat__joinGroup(input: $input)\n  }\n": types.Chat__JoinGroupDocument,
    "\n  mutation Chat__joinInPerson($input: JoinInPersonInput!) {\n    chat__joinInPerson(input: $input) {\n      _id\n    }\n  }\n": types.Chat__JoinInPersonDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GET_USER_QUERIES {\n    identity__me {\n      _id\n      handle\n      referenceHandle\n      accountStatus\n      lastLoginAt\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GET_USER_QUERIES {\n    identity__me {\n      _id\n      handle\n      referenceHandle\n      accountStatus\n      lastLoginAt\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Identity__resetPin($input: ResetPinInput!) {\n    identity__resetPin(input: $input)\n  }\n"): (typeof documents)["\n  mutation Identity__resetPin($input: ResetPinInput!) {\n    identity__resetPin(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Chat__roomMessages($roomId: String!, $where: CommonPaginationOnlyDto) {\n    chat__roomMessages(roomId: $roomId, where: $where) {\n      meta {\n        totalCount\n        hasNextPage\n      }\n      nodes {\n        _id\n        messageType\n        text\n        createdAt\n        updatedAt\n        createdBy {\n          _id\n          handle\n        }\n        chatRoom {\n          _id\n          handle\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Chat__roomMessages($roomId: String!, $where: CommonPaginationOnlyDto) {\n    chat__roomMessages(roomId: $roomId, where: $where) {\n      meta {\n        totalCount\n        hasNextPage\n      }\n      nodes {\n        _id\n        messageType\n        text\n        createdAt\n        updatedAt\n        createdBy {\n          _id\n          handle\n        }\n        chatRoom {\n          _id\n          handle\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Chat__myChatRooms($where: CommonPaginationOnlyDto) {\n    chat__myChatRooms(where: $where) {\n      nodes {\n        _id\n        handle\n        members {\n          handle\n        }\n        lastMessage {\n          text\n        }\n        lastMessageSender {\n          handle\n        }\n        isNsfw\n        roomType\n      }\n    }\n  }\n"): (typeof documents)["\n  query Chat__myChatRooms($where: CommonPaginationOnlyDto) {\n    chat__myChatRooms(where: $where) {\n      nodes {\n        _id\n        handle\n        members {\n          handle\n        }\n        lastMessage {\n          text\n        }\n        lastMessageSender {\n          handle\n        }\n        isNsfw\n        roomType\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Chat__createChatGroup($input: CreateChatGroupInput!) {\n    chat__createChatGroup(input: $input) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation Chat__createChatGroup($input: CreateChatGroupInput!) {\n    chat__createChatGroup(input: $input) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Chat__getUniqueGroupHandle($handle: String!) {\n    chat__getUniqueRoomHandle(handle: $handle)\n  }\n"): (typeof documents)["\n  mutation Chat__getUniqueGroupHandle($handle: String!) {\n    chat__getUniqueRoomHandle(handle: $handle)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Chat__joinGroup($input: JoinOrLeaveGroupInput!) {\n    chat__joinGroup(input: $input)\n  }\n"): (typeof documents)["\n  mutation Chat__joinGroup($input: JoinOrLeaveGroupInput!) {\n    chat__joinGroup(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Chat__joinInPerson($input: JoinInPersonInput!) {\n    chat__joinInPerson(input: $input) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation Chat__joinInPerson($input: JoinInPersonInput!) {\n    chat__joinInPerson(input: $input) {\n      _id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;