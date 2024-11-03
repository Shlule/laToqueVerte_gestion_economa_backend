import * as bcrypt from 'bcrypt'

const SALT = 10;
export async function hashingPassword(rawPassword: string){
    return bcrypt.hash(rawPassword, SALT);
}