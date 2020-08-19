<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ioweyou-tech">ioweyou.tech v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

# Authentication

* API Key (userAuthenticated)
    - Parameter Name: **access_tokens**, in: cookie. Security scheme protecting endpoints that require a regular authenticated user account.

<h1 id="ioweyou-tech-login">Login</h1>

## post__users_login

> Code samples

```javascript
const inputBody = '{
  "username": "jsmith",
  "password": "hunter2"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /users/login`

> Body parameter

```json
{
  "username": "jsmith",
  "password": "hunter2"
}
```

<h3 id="post__users_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Username of the account attempting to login.|
|» password|body|string|false|Plaintext password of the user. If present, this will be used to attempt authentication, regardless of whether the "access_tokens" cookie is present.|
|access_tokens|cookie|string|false|If present and the password was not provided in request body, this JSON Web Token will be decoded and the refresh_token used to attempt authentication.|

<h3 id="post__users_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned when the login was successful. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens).|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Returned when required query parameters were not provided, or invalid.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Returned when the password supplied is incorrect, or the refresh token has expired.|None|

<aside class="success">
This operation does not require authentication
</aside>

