import { GamePlayer } from "./game-player";

export class Game {

    constructor(
        public gameName: string,
        public gamePassword: string,
        public players: GamePlayer[],
        public activePlayerName: string

    ) { }
}