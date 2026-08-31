import { Messages } from "../Interface/messages.Interface";

export type CreateMessagesDTO = Pick<Messages, `author_id` | `chat_id` | `message`>
export type UpdateMessagesDTO = Partial<Pick<Messages, 'message'>>
