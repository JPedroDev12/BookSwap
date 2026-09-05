import { Chat } from "../Interface/chat.Interface";

export type CreateChatDTO = Pick<Chat, `user1_id` | `user2_id`>
export type UpdateChatDTO = Partial<CreateChatDTO>