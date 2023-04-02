export class Role {
    static includes(arg0: string): boolean {
      throw new Error('Method not implemented.');
    }
    id?: string;
    name: string;
  
    constructor(name: string) {
      this.name = name;
    }
  }