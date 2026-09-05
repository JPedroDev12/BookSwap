import { BookTrade } from "../Interface/bookTrade.Interface";

export type CreateBookTradeDTO = Pick<BookTrade, `book_id` | `user_id`>
export type UpdateBookTradeDTO = Partial<BookTrade>;
