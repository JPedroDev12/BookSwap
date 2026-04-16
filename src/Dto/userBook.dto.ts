import { UserBook } from "../Interface/userBookInterface";

export type CreateUserBookDTO = Pick<UserBook, `book_id` | `status` | `user_id`>
export type UpdateUserBookDTO = Partial<CreateUserBookDTO>;