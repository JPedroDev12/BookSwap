import { User } from "../Interface/user.Interface";

export type CreateUserDTO = Pick<User, `CPF` | `email` | `password` | `username`>
export type UpdateUserDTO = Partial<Pick<User, `CPF` | `email` | `username`>> & {
    theme_status?: 'Modo claro' | 'Modo escuro';
};