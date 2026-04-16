import { Likes } from "../Interface/likesInterface";

export type CreateLikesDTO = Pick<Likes, `book_id` | `user_id`>
export type UpdateLikesDTO = Partial<CreateLikesDTO>