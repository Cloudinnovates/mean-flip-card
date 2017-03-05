export class Player {
    username: string;
    customCards: string[]; //To be used if custom card images allowed

    constructor() {
        this.username = "";
        this.customCards = new Array<string>();
    }
}
