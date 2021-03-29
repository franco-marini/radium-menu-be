import bcrypt from 'bcrypt';

const encryptPassword = (password: string) => bcrypt.hashSync(password, 8);

const decryptPassword = (password: string, userPassword: string) =>
  bcrypt.compare(password, userPassword);

export default {
  encryptPassword,
  decryptPassword,
};
