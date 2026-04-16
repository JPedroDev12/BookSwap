import { User } from "../Interface/userInterface";

export type CreateUserDTO = Pick<User, `CPF` | `email` | `email` | `password` | `username`>
export type UpdateUserDTO = Partial<CreateUserDTO> & {
    theme_status?: 'Modo claro' | 'Modo escuro';
};