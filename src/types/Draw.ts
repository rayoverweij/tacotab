import { Room } from "./Room";

export type Draw = {
    generated: boolean,
    roomsOne: Room[],
    roomsTwo: Room[],
    [key: string]: boolean | Room[]
}