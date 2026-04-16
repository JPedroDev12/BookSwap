import { Messages } from "../Interface/messageInterface";

export type CreateMessagesDTO = Pick<Messages, `author_id` | `chat_id` | `message`>
export type UpdateMessagesDTO = Partial<CreateMessagesDTO>