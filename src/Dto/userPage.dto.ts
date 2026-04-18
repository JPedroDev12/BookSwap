import { UserPage } from "../Interface/userPage.Interface";

export type CreateUserPageDTO = Pick<UserPage, 'user_id' | 'description' | 'photo_url'>
export type UpdateUserPageDTO = Partial<Pick<UserPage, 'description' | 'photo_url'>>