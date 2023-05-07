# Authorization api module
## Methods:
 * [GET /listUsers](./authMethods/listUsers.md)
 * [GET /signIn](./authMethods/signIn.md)
 * [GET /signOut](./authMethods/signOut.md)
 * [POST /addUser](./authMethods/addUser.md)
 * [PATCH /updateUser](./authMethods/updateUser.md)
 * [DELETE /deleteUser](./authMethods/deleteUser.md)
***
## Cookies:

* **"email"**

  This is cookie for authorization

  Value is hashed string of email
* **"is-logged-in"**

  This is cookie for authorization

  Value is true or false or undefined
* **"library"**

  This is header for contain library for authorized user

  Value is coded string

  You should parse value by use standart decode cookie function
  ```
  function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  ```
***
## Headers:
* **"hash-pass"**

  This is header for authorization by using password

  Value is hashed string of password 

  You should use hash function for password from input and add this header to signIn request 
***