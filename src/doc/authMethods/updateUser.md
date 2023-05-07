# PATCH /updateUser
## Path
### rs-clone-api.vercel.app/updateUser
***
### Requst body
  ```
{
    "userName": "Kshusha Motevich",
    "phone": "+375299882978"
}
  ```  
***
## Cookies:
* **"email"**
* **"is-logged-in"**
***
### Fetch request example
```
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "email=1829; is-logged-in=true; library=%7B%22_id%22%3A%2263f0ae4c20cbcafdb4804cd4%22%2C%22email%22%3A%22kshusha%40gmail.com%22%2C%22likedPodcasts%22%3A%5B%5D%2C%22subscribedPodcasts%22%3A%5B%5D%7D");

var raw = JSON.stringify({
  "userName": "Kshusha Motevich",
  "phone": "+375299882978"
});

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("rs-clone-api.vercel.app/updateUser/kshusha@gmail.com", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```