import { Matches } from "../Interface/matchesInterface";

export type CreateMatchesDTO = Pick<Matches, `user1_id` | `user2_id`>
export type UpdateMatchesDTO = Partial<CreateMatchesDTO>