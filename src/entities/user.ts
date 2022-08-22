import { Group } from "./group";

export class User {
    public static clone(user: User): User {
        return new User(user.name, 
                        user.email, 
                        user.id, 
                        user.lastLogin, 
                        user.password,
                        user.active,
                        user.groups?.map(group => Group.clone(group)));
      }

      constructor(
        public name: string,
        public email: string,
        public id?: number,
        public lastLogin?: Date,
        public password: string = '',
        public active: boolean = true,
        public groups: Group[] = []
      ){}

    toString(): string {
        return this.name + ' ' + this.email;
    }
}