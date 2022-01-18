//-------------------------
// Model User
//-------------------------
export default class User {
  constructor(username, email, password, firstname, lastname, phonenumber, role) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phonenumber = phonenumber;
    this.role = role;
  }
}