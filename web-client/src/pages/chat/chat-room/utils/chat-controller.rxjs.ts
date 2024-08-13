import { ChatMessage } from '@/common/api-models/graphql';
import { Subject } from 'rxjs';

export const messageSendByCurrentUserSubject = new Subject<ChatMessage>();
