import { UserPage } from "../Interface/userPageInterface";

export type CreateUserPageDTO = Pick<UserPage, `description` | `user_id`>
export type UpdateUserPageDTO = Partial<CreateUserPageDTO>