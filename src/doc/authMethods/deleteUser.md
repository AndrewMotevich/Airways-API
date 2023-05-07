# DELETE /updateUser
## Path
### rs-clone-api.vercel.app/deleteUser **(*/:email*)**
***
### Path Variables
- **email**
***
### Fetch request example
```
var myHeaders = new Headers();
myHeaders.append("Cookie", "email=1829; is-logged-in=true; library=%7B%22_id%22%3A%2263f0ae4c20cbcafdb4804cd4%22%2C%22email%22%3A%22kshusha%40gmail.com%22%2C%22likedPodcasts%22%3A%5B%5D%2C%22subscribedPodcasts%22%3A%5B%5D%7D");

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("rs-clone-api.vercel.app/deleteUser/kshusha@gmail.com", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```