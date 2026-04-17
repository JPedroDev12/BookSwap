import { Swapping } from "../Interface/swapping.Interface";

export type CreateSwappingDTO = Pick<Swapping, `action` | `book_id` | `swapping_id`>
export type UpdateSwappingDTO = Partial<CreateSwappingDTO>