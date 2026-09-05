export type Reaction = | `like` | `dislike` | `skip`;

export interface Swapping {
    id: number;
    swapping_id: number; // Usuario
    book_trade_id: number;
    action: Reaction;
}