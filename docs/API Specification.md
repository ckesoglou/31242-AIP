<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ioweyou-tech">ioweyou.tech v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

# Authentication

* API Key (userAuthenticated)
    - Parameter Name: **access_tokens**, in: cookie. Security scheme protecting endpoints that require a regular authenticated user account.

<h1 id="ioweyou-tech-default">Default</h1>

## get__login

> Code samples

```javascript

fetch('/login',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /login`

Attempts to authenticate the user with the refresh JSON Web Token (if stored in the client's cookies) and redirects the user. Otherwise, the React login webpage will be returned.

<h3 id="get__login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|access_tokens|cookie|string|false|If present, this JSON Web Token cookie will be decoded and used to attempt authentication. Contains a refresh_token property and username property.|

<h3 id="get__login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned with the react login page when refresh token authentication failed or did not take place.|None|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Returned when refresh token authentication succeeded, redirecting to the dashboard React page or user's referrer URL (if within the application).|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-login">Login</h1>

## post__login

> Code samples

```javascript
const inputBody = '{
  "username": "jsmith",
  "password": "hunter2"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/login',
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

`POST /login`

Attempts authentication with the provided username and password in the requestBody. Sets the access_tokens cookie alongside a redirect request if successful.

> Body parameter

```json
{
  "username": "jsmith",
  "password": "hunter2"
}
```

<h3 id="post__login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Username of the account attempting to login.|
|» password|body|string|true|Plaintext password of the user.|

<h3 id="post__login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Returned when the login was successful. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens) and redirect the user to the referrer URL (if within the application) or the dashboard.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Returned when required requestBody was not provided, or invalid.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Returned when the password supplied is incorrect.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-signup">Signup</h1>

## post__signup

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

fetch('/signup',
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

`POST /signup`

Attempts to create a user with the provided username, display name, and password in the requestBody. Sets the access_tokens cookie alongside a redirect request if successful.

> Body parameter

```json
{
  "username": "jsmith",
  "display_name": "John Smith",
  "password": "hunter2"
}
```

<h3 id="post__signup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Desired username for the to-be-created account.|
|» display_name|body|string|false|Desired display name for the to-be-created account.|
|» password|body|string|true|Plaintext password for the to-be-created account.|

<h3 id="post__signup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Returned when the user is successfully created. This will set a JSON Web Token as a httpOnly cookie (with access & refresh tokens).|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Returned when required requestBody was not provided, or invalid.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Returned when the username is already taken.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ioweyou-tech-request">Request</h1>

## get__api_requests

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/requests',
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

`GET /api/requests`

Retrieve a list of requests, optionally matched to provided criteria.

<h3 id="get__api_requests-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|author|query|string|false|Filter based on request author.|
|search|query|string|false|Filter for requests whose details contain the provided string.|
|createdAfter|query|string|false|Filter for requests created after or on this date (YYYY-MM-DD).|
|createdBefore|query|string|false|Filter for requests created before or on this date (YYYY-MM-DD).|
|completedAfter|query|string|false|Filter for requests completed after or on this date (YYYY-MM-DD).|
|completedBefore|query|string|false|Filter for requests completed before or on this date (YYYY-MM-DD).|
|completed|query|boolean|false|Filter based on whether the request is completed or not.|
|completedBy|query|string|false|Filter based on which user completed the request.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "author": "string",
    "completed_by": "string",
    "proof_of_completion": "string",
    "details": "string",
    "created_time": "string",
    "completion_time": "string",
    "is_completed": true,
    "rewards": [
      {
        "id": "string",
        "item": "string",
        "item_display_name": "string",
        "giver": "string"
      }
    ]
  }
]
```

<h3 id="get__api_requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request was understood, and the matching requests are returned (if any).|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="get__api_requests-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[request](#schemarequest)]|false|none|none|
|» id|string|false|none|Unique identifier of the request|
|» author|string|false|none|Author of the request|
|» completed_by|string|false|none|Username of who completed the request|
|» proof_of_completion|string|false|none|Unique identifier for the proof of completion image|
|» details|string|false|none|Details of the request|
|» created_time|string|false|none|Timestamp of when the request was created|
|» completion_time|string|false|none|Timestamp of when the request was completed|
|» is_completed|boolean|false|none|Whether or not the request is completed|
|» rewards|[object]|false|none|none|
|»» id|string|false|none|Unique identifier of the reward (IOU)|
|»» item|string|false|none|Unique identifier of the reward item|
|»» item_display_name|string|false|none|Display name of the item|
|»» giver|string|false|none|Username of who is providing this reward|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_requests

> Code samples

```javascript
const inputBody = '{
  "details": "Clean my fridge"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/requests',
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

`POST /api/requests`

Create a request.

> Body parameter

```json
{
  "details": "Clean my fridge"
}
```

<h3 id="post__api_requests-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» details|body|string|true|Details of the request (what you are asking for), limited to 50 bytes.|

> Example responses

> 201 Response

```json
{
  "id": "424195ef-eb69-492e-bc5a-741d664a99aa"
}
```

<h3 id="post__api_requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Request was successfully created.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="post__api_requests-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|ID of the created request|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_request_{requestID}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/request/{requestID}',
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

`GET /api/request/{requestID}`

Retrieves details of a given request.

<h3 id="get__api_request_{requestid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "author": "string",
  "completed_by": "string",
  "proof_of_completion": "string",
  "details": "string",
  "created_time": "string",
  "completion_time": "string",
  "is_completed": true,
  "rewards": [
    {
      "id": "string",
      "item": "string",
      "item_display_name": "string",
      "giver": "string"
    }
  ]
}
```

<h3 id="get__api_request_{requestid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request was found, and it's details are returned.|[request](#schemarequest)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_request_{requestID}

> Code samples

```javascript
const inputBody = '{
  "details": "Clean my fridge"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/request/{requestID}',
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

`PUT /api/request/{requestID}`

Endpoint to update a request

> Body parameter

```json
{
  "details": "Clean my fridge"
}
```

<h3 id="put__api_request_{requestid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|
|body|body|object|true|none|
|» details|body|string|true|Updated details of the request (what you are asking for), limited to 50 bytes.|

> Example responses

> 400 Response

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}
```

<h3 id="put__api_request_{requestid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request successfully updated.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No request was found for the given ID.|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_request_{requestID}

> Code samples

```javascript

fetch('/api/request/{requestID}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/request/{requestID}`

Endpoint to delete a request

<h3 id="delete__api_request_{requestid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|

<h3 id="delete__api_request_{requestid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request successfully deleted|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to delete this request (you are not the owner of it)|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The request was not found|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_request_{requestID}_rewards

> Code samples

```javascript
const inputBody = '{
  "item": "65023bcb-bee9-416f-b3a9-d996212b99f1"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/request/{requestID}/rewards',
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

`POST /api/request/{requestID}/rewards`

Create a new reward for this request

> Body parameter

```json
{
  "item": "65023bcb-bee9-416f-b3a9-d996212b99f1"
}
```

<h3 id="post__api_request_{requestid}_rewards-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|
|body|body|object|true|none|
|» item|body|string|true|Unique identifier for item being offered as a reward|

> Example responses

> 201 Response

```json
{
  "id": "1ce5d3cc-cb15-4050-9f0f-95d089721ed8"
}
```

<h3 id="post__api_request_{requestid}_rewards-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Returned when the reward was successfully created|Inline|

<h3 id="post__api_request_{requestid}_rewards-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|ID of the created reward (IOU)|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_request_{requestID}_rewards_{rewardID}

> Code samples

```javascript

fetch('/api/request/{requestID}/rewards/{rewardID}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/request/{requestID}/rewards/{rewardID}`

Deleted the given request reward.

<h3 id="delete__api_request_{requestid}_rewards_{rewardid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|
|rewardID|path|string|true|Unique identifier of a given request reward (IOU).|

<h3 id="delete__api_request_{requestid}_rewards_{rewardid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request reward successfully deleted|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to delete this request reward (you are not the owner of it)|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Either the request or reward was not found|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_request">request</h2>
<!-- backwards compatibility -->
<a id="schemarequest"></a>
<a id="schema_request"></a>
<a id="tocSrequest"></a>
<a id="tocsrequest"></a>

```json
{
  "id": "string",
  "author": "string",
  "completed_by": "string",
  "proof_of_completion": "string",
  "details": "string",
  "created_time": "string",
  "completion_time": "string",
  "is_completed": true,
  "rewards": [
    {
      "id": "string",
      "item": "string",
      "item_display_name": "string",
      "giver": "string"
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier of the request|
|author|string|false|none|Author of the request|
|completed_by|string|false|none|Username of who completed the request|
|proof_of_completion|string|false|none|Unique identifier for the proof of completion image|
|details|string|false|none|Details of the request|
|created_time|string|false|none|Timestamp of when the request was created|
|completion_time|string|false|none|Timestamp of when the request was completed|
|is_completed|boolean|false|none|Whether or not the request is completed|
|rewards|[object]|false|none|none|
|» id|string|false|none|Unique identifier of the reward (IOU)|
|» item|string|false|none|Unique identifier of the reward item|
|» item_display_name|string|false|none|Display name of the item|
|» giver|string|false|none|Username of who is providing this reward|

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

