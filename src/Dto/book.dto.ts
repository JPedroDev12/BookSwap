import { Book } from "../Interface/bookInterface";

export type CreateBookDTO = Pick<Book, `title` | `genre` | `author` | `isbn` | `year_published` | `cover_url` | `description` | `user_id`>
export type UpdateBookDTO = Partial<Pick<Book, `title` | `author` | `cover_url` | `description` | `genre` | `isbn` | `year_published`>>