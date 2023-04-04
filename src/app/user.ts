import { Card } from "./card";
import { Role } from "./role";

export class User {

    constructor(
        public email: string,
        public username: string,
        public password: string,
        public rawPassword: string,
        public  favouriteVideos: Set<string>,
        public roles: Set<Role>,
        public pendingRoleRequests: Set<Role>,
        public allCards: Card[],
        public userDecks: Map<string, string[]>
        
    ){}
  }