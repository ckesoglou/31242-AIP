<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ioweyou-tech">ioweyou.tech v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

# Authentication

- API Key (userAuthenticated)
  - Parameter Name: **access_tokens**, in: cookie. Security scheme protecting endpoints that require a regular authenticated user account.

<h1 id="ioweyou-tech-default">Default</h1>

## get\_\_users_login

> Code samples

```javascript
fetch("/users/login", {
  method: "GET",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /users/login`

Attempts to authenticate the user with the refresh JSON Web Token (if stored in the client's cookies) and redirects the user. Otherwise, the React login webpage will be returned.

<h3 id="get__users_login-parameters">Parameters</h3>

| Name          | In     | Type   | Required | Description                                                                                                                                         |
| ------------- | ------ | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| access_tokens | cookie | string | false    | If present, this JSON Web Token cookie will be decoded and used to attempt authentication. Contains a refresh_token property and username property. |

<h3 id="get__users_login-responses">Responses</h3>

| Status | Meaning                                                    | Description                                                                                                                                       | Schema |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)    | Returned with the react login page when refresh token authentication failed or did not take place.                                                | None   |
| 302    | [Found](https://tools.ietf.org/html/rfc7231#section-6.4.3) | Returned when refresh token authentication succeeded, redirecting to the dashboard React page or user's referrer URL (if within the application). | None   |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-login">Login</h1>

## post\_\_users_login

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

Attempts authentication with the provided username and password in the requestBody. Sets the access_tokens cookie alongside a redirect request if successful.

> Body parameter

```json
{
  "username": "jsmith",
  "password": "hunter2"
}
```

<h3 id="post__users_login-parameters">Parameters</h3>

| Name       | In   | Type   | Required | Description                                  |
| ---------- | ---- | ------ | -------- | -------------------------------------------- |
| body       | body | object | true     | none                                         |
| » username | body | string | true     | Username of the account attempting to login. |
| » password | body | string | true     | Plaintext password of the user.              |

<h3 id="post__users_login-responses">Responses</h3>

| Status | Meaning                                                          | Description                                                                                                                                                                                                        | Schema |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 302    | [Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)       | Returned when the login was successful. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens) and redirect the user to the referrer URL (if within the application) or the dashboard. | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Returned when required requestBody was not provided, or invalid.                                                                                                                                                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | Returned when the password supplied is incorrect.                                                                                                                                                                  | None   |

<aside class="success">
This operation does not require authentication
</aside>
