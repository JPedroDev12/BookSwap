import { UserBook } from "../Interface/userBook.Interface";

export type CreateUserBookDTO = Pick<UserBook, `book_id` | `status` | `user_id`> & Partial<Pick<UserBook, `rating`>>
export type UpdateUserBookDTO = Partial<Pick<UserBook, `book_id` | `status` | `user_id` | `rating`>>;