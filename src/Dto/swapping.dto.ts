import { Swapping } from "../Interface/swapping.Interface";

export type CreateSwappingDTO = Pick<Swapping, 'swapping_id' | 'book_trade_id' | 'action'>
export type UpdateSwappingDTO = Partial<CreateSwappingDTO>