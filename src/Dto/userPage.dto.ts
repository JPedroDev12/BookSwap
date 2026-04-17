import { UserPage } from "../Interface/userPage.Interface";

export type CreateUserPageDTO = Pick<UserPage, `description` | `user_id`>
export type UpdateUserPageDTO = Partial<CreateUserPageDTO>