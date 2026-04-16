import { BookTrade } from "../Interface/bookTradeInterface";

export type CreateBookTradeDTO = Pick<BookTrade, `book_id` | `user_id`>
export type UpdateBookTradeDTO = Partial<BookTrade>;
