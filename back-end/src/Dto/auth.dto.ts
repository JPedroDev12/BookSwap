import { User } from "../Interface/user.Interface";

export type RegisterUserDTO = Pick<User, "username" | "email" | "password"> &
    Partial<Pick<User, "CPF">>;

export type LoginUserDTO = Pick<User, "email" | "password">;
