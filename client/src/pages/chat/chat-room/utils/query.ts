import { gql } from '@apollo/client';

export const CHAT_ROOM_DETAILS_QUERY = gql`
  query Chat__chatRoom($roomId: String!) {
    chat__chatRoom(roomId: $roomId) {
      _id
      handle
      isNsfw
      roomType
      owner {
        _id
        handle
      }
      moderators {
        _id
      }
      members {
        _id
        handle
      }
      kickedUsers {
        _id
      }
      createdAt
      updatedAt
    }
  }
`;

export const LEAVE_CHAT_ROOM_MUTATION = gql`
  mutation Chat__leaveChatRoom($roomId: String!) {
    chat__leaveChatRoom(roomId: $roomId)
  }
`;
