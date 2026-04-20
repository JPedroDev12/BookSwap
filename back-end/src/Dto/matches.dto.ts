import { Matches } from "../Interface/matches.Interface";

export type CreateMatchesDTO = Pick<Matches, `user1_id` | `user2_id`>
export type UpdateMatchesDTO = Partial<CreateMatchesDTO>