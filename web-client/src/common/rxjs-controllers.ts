import { Subject } from 'rxjs';

export const $triggerRefetchMe = new Subject<boolean>();
export const $triggerRefetchChatRooms = new Subject<boolean>();
