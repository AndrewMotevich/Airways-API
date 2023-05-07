# GET /allPlaylists
## Path
### rs-clone-api.vercel.app/allPlaylists
***
## Headers
* **"admin-pass"** **"root"**
***
### Example fetch request
```var myHeaders = new Headers();
myHeaders.append("admin-pass", "root");
myHeaders.append("Cookie", "email=1829; is-logged-in=true;);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("rs-clone-api.vercel.app/allPlaylists", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));