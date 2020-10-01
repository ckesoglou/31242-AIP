<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ioweyou-tech">ioweyou.tech v1.1.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

# Authentication

* API Key (userAuthenticated)
    - Parameter Name: **access_tokens**, in: cookie. Security scheme protecting endpoints that require a regular authenticated user account. Contains a refresh_token property and username property.

<h1 id="ioweyou-tech-authentication">Authentication</h1>

## post__api_login

> Code samples

```javascript
const inputBody = '{
  "username": "jsmith",
  "password": "hunter2"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/login',
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

`POST /api/login`

Attempts authentication with the provided username and password in the requestBody. Sets the access_tokens cookie alongside a redirect request if successful.

> Body parameter

```json
{
  "username": "jsmith",
  "password": "hunter2"
}
```

<h3 id="post__api_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Username of the account attempting to login.|
|» password|body|string|true|Plaintext password of the user.|

<h3 id="post__api_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Returned when the login was successful. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens) and redirect the user to the referrer URL (if within the application) or the dashboard.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Returned when required requestBody was not provided, or invalid.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Returned when the password supplied is incorrect.|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_signup

> Code samples

```javascript
const inputBody = '{
  "username": "jsmith",
  "display_name": "John Smith",
  "password": "hunter2"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/signup',
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

`POST /api/signup`

Attempts to create a user with the provided username, display name, and password in the requestBody. Sets the access_tokens cookie if successful.

> Body parameter

```json
{
  "username": "jsmith",
  "display_name": "John Smith",
  "password": "hunter2"
}
```

<h3 id="post__api_signup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Desired username for the to-be-created account.|
|» display_name|body|string|true|Desired display name for the to-be-created account.|
|» password|body|string|true|Plaintext password for the to-be-created account.|

<h3 id="post__api_signup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Returned when the user is successfully created. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens).|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Returned when required requestBody was not provided, or invalid.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Returned when the username is already taken.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-user">User</h1>

## get__api_user

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/user',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/user`

Attempts to view the user information with the refresh JSON Web Token (if stored in the client's cookies).

> Example responses

> 200 Response

```json
{
  "username": "jsmith",
  "display_name": "John Smith"
}
```

<h3 id="get__api_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned user information.|[User](#schemauser)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid user supplied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="get__api_user-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## put__api_user

> Code samples

```javascript
const inputBody = '{
  "username": "jsmith",
  "display_name": "John Smith"
}';
const headers = {
  'Content-Type':'*/*'
};

fetch('/api/user',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/user`

Attempts to update user if they are currently logged in

> Body parameter

<h3 id="put__api_user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[User](#schemauser)|true|Updated user object|

> Example responses

<h3 id="put__api_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Resource updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid user supplied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="put__api_user-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## delete__api_user

> Code samples

```javascript

fetch('/api/user',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/user`

Attempts to delete user if they are currently logged in

> Example responses

<h3 id="delete__api_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Resource deleted successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid user supplied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="delete__api_user-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## get__api_user_requests

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/user/requests',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/user/requests`

Attempts to view the requests created by a user with the refresh JSON Web Token (if stored in the client's cookies).

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "author": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "completed_by": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "proof_of_completion": 0,
    "details": "Clean the fridge",
    "created_time": "2020-03-09T22:18:26.625Z",
    "completion_time": "2020-03-09T22:18:26.625Z",
    "is_completed": false
  }
]
```

<h3 id="get__api_user_requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned list of requests created by user.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid user supplied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="get__api_user_requests-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Request](#schemarequest)]|false|none|none|
|» id|integer|true|none|none|
|» author|[User](#schemauser)|true|none|none|
|»» username|string|true|none|none|
|»» display_name|string|false|none|none|
|» completed_by|[User](#schemauser)|false|none|none|
|» proof_of_completion|integer|false|none|none|
|» details|string|true|none|none|
|» created_time|string(date-time)|true|none|none|
|» completion_time|string(date-time)|false|none|none|
|» is_completed|boolean|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## get__api_user_logout

> Code samples

```javascript

fetch('/api/user/logout',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/user/logout`

Attempts to log user out of current session.

> Example responses

<h3 id="get__api_user_logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|default|Default|Successful logout|None|

<h3 id="get__api_user_logout-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-leaderboard">Leaderboard</h1>

## get__api_leaderboard

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/leaderboard',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/leaderboard`

Retrieve the current leaderboard.

<h3 id="get__api_leaderboard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|start|query|string|false|Starting row of the returned array. Default 0.|
|limit|query|string|false|Maximum number of returned items. Default 25. Maximum 100.|

> Example responses

> 200 Response

```json
[
  {
    "rank": 1,
    "user": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "score": 35
  }
]
```

<h3 id="get__api_leaderboard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Leaderboard retrieved and returned successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="get__api_leaderboard-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» rank|number|false|none|Rank of this user.|
|» user|[User](#schemauser)|false|none|none|
|»» username|string|true|none|none|
|»» display_name|string|false|none|none|
|» score|number|false|none|Numeric leaderboard score of this user.|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_leaderboard_me

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/leaderboard/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/leaderboard/me`

Retrieve the current score and rank of the logged in user.

> Example responses

> 200 Response

```json
{
  "rank": 1,
  "score": 35
}
```

<h3 id="get__api_leaderboard_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Leaderboard position of the current user retrieved and returned.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

<h3 id="get__api_leaderboard_me-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» rank|number|false|none|Rank of this user.|
|» score|number|false|none|Numeric leaderboard score of this user.|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "username": "jsmith",
  "display_name": "John Smith"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|true|none|none|
|display_name|string|false|none|none|

<h2 id="tocS_IOU">IOU</h2>
<!-- backwards compatibility -->
<a id="schemaiou"></a>
<a id="schema_IOU"></a>
<a id="tocSiou"></a>
<a id="tocsiou"></a>

```json
{
  "id": 0,
  "item": {
    "id": 0,
    "display_name": "Coffee"
  },
  "giver": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "receiver": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "parent_request": {
    "id": 0,
    "author": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "completed_by": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "proof_of_completion": 0,
    "details": "Clean the fridge",
    "created_time": "2020-03-09T22:18:26.625Z",
    "completion_time": "2020-03-09T22:18:26.625Z",
    "is_completed": false
  },
  "proof_of_debt": 0,
  "proof_of_completion": 0,
  "created_time": "2020-03-09T22:18:26.625Z",
  "claimed_time": "2020-03-09T22:18:26.625Z",
  "is_claimed": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|true|none|none|
|item|[Item](#schemaitem)|true|none|none|
|giver|[User](#schemauser)|true|none|none|
|receiver|[User](#schemauser)|false|none|none|
|parent_request|[Request](#schemarequest)|false|none|none|
|proof_of_debt|integer|false|none|none|
|proof_of_completion|integer|false|none|none|
|created_time|string(date-time)|true|none|none|
|claimed_time|string(date-time)|false|none|none|
|is_claimed|boolean|true|none|none|

<h2 id="tocS_Item">Item</h2>
<!-- backwards compatibility -->
<a id="schemaitem"></a>
<a id="schema_Item"></a>
<a id="tocSitem"></a>
<a id="tocsitem"></a>

```json
{
  "id": 0,
  "display_name": "Coffee"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|true|none|none|
|display_name|string|true|none|none|

<h2 id="tocS_Request">Request</h2>
<!-- backwards compatibility -->
<a id="schemarequest"></a>
<a id="schema_Request"></a>
<a id="tocSrequest"></a>
<a id="tocsrequest"></a>

```json
{
  "id": 0,
  "author": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "completed_by": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "proof_of_completion": 0,
  "details": "Clean the fridge",
  "created_time": "2020-03-09T22:18:26.625Z",
  "completion_time": "2020-03-09T22:18:26.625Z",
  "is_completed": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|true|none|none|
|author|[User](#schemauser)|true|none|none|
|completed_by|[User](#schemauser)|false|none|none|
|proof_of_completion|integer|false|none|none|
|details|string|true|none|none|
|created_time|string(date-time)|true|none|none|
|completion_time|string(date-time)|false|none|none|
|is_completed|boolean|true|none|none|

<h2 id="tocS_badRequest">badRequest</h2>
<!-- backwards compatibility -->
<a id="schemabadrequest"></a>
<a id="schema_badRequest"></a>
<a id="tocSbadrequest"></a>
<a id="tocsbadrequest"></a>

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|errors|[string]|false|none|none|

