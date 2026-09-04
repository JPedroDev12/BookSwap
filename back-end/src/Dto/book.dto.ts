import { Book } from "../Interface/book.Interface";

export type CreateBookDTO = Pick<Book, `title` | `genre` | `author` | `isbn` | `year_published` | `cover_url` | `description` | `user_id` | `price`> & Partial<Pick<Book, `listed_in_store`>>
export type UpdateBookDTO = Partial<Pick<Book, `title` | `author` | `cover_url` | `description` | `genre` | `isbn` | `year_published` | `price` | `listed_in_store`>>