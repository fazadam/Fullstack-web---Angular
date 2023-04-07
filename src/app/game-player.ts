import { Card } from "./card";

export class GamePlayer {

    constructor(
        public playerName: string,
        public currentDeckCards: Card[],
        public activeCard: Card,
        public gamePoints: number,
        public totalWins: number,

    ) { }
}