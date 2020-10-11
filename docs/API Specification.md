<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ioweyou-tech">ioweyou.tech v1.2.0</h1>

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
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

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

<h3 id="put__api_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Resource updated successfully|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

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

<h3 id="delete__api_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Resource deleted successfully|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

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

<h1 id="ioweyou-tech-iou">IOU</h1>

## get__api_iou_owed

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/iou/owed',
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

`GET /api/iou/owed`

View the favours owed to the currently logged in user.

<h3 id="get__api_iou_owed-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|start|query|string|false|Starting row of the returned array. Default 0.|
|limit|query|string|false|Maximum number of returned items. Default 25. Maximum 100.|

> Example responses

> 200 Response

```json
[
  {
    "id": "510ab12d-1689-4b2c-8a8d-275376f11077",
    "item": {
      "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
      "display_name": "Coffee"
    },
    "giver": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "parent_request": "510ab12d-1689-4b2c-8a8d-275376f11078",
    "proof_of_debt": "510ab12d-1689-4b2c-8a8d-275376f11079",
    "proof_of_completion": "510ab12d-1689-4b2c-8a8d-275376f11076",
    "created_time": "2020-03-09T22:18:26.625Z",
    "claimed_time": "2020-03-09T22:18:26.625Z",
    "is_claimed": false
  }
]
```

<h3 id="get__api_iou_owed-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned list of favours owed to user.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid user supplied|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to view these IOUs (you are not the giver/receiver of it)|None|

<h3 id="get__api_iou_owed-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier for an IOU|
|» item|[Item](#schemaitem)|false|none|none|
|»» id|string|false|none|Unique identifier of the item.|
|»» display_name|string|false|none|Current display name of the item.|
|» giver|[User](#schemauser)|false|none|none|
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
|» parent_request|string|false|none|Unique identifier for an IOU|
|» proof_of_debt|string|false|none|Unique identifier for an image|
|» proof_of_completion|string|false|none|Unique identifier for an image|
|» created_time|string(date-time)|false|none|none|
|» claimed_time|string(date-time)|false|none|none|
|» is_claimed|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## post__api_iou_owed

> Code samples

```javascript
const inputBody = '{
  "username": "janesmith",
  "item": "510ab12d-1689-4b2c-8a8d-275376f11077",
  "proof": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/iou/owed',
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

`POST /api/iou/owed`

Record a new IOU that you are owed

> Body parameter

```yaml
username: janesmith
item: 510ab12d-1689-4b2c-8a8d-275376f11077
proof: string

```

<h3 id="post__api_iou_owed-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|false|Username of person who owes you|
|» item|body|string|false|Unique identifier of the item they owe you|
|» proof|body|string(binary)|false|Image proof of debt|

> Example responses

> 201 Response

```json
{
  "id": "510ab12d-1689-4b2c-8a8d-275376f11077"
}
```

<h3 id="post__api_iou_owed-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|IOU has been created.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

<h3 id="post__api_iou_owed-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier for the newly created IOU|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## put__api_iou_owed_{iouID}_complete

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/iou/owed/{iouID}/complete',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/iou/owed/{iouID}/complete`

Mark an IOU as completed

<h3 id="put__api_iou_owed_{iouid}_complete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|iouID|path|string|true|Unique identifier for the IOU|

> Example responses

> 400 Response

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}
```

<h3 id="put__api_iou_owed_{iouid}_complete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|IOU was successfully completed.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to complete this request (you are not the owner of it)|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found (did you mean to use the /owe endpoint)|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## get__api_iou_owe

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/iou/owe',
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

`GET /api/iou/owe`

View favours the currently logged in user owes to others.

<h3 id="get__api_iou_owe-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|start|query|string|false|Starting row of the returned array. Default 0.|
|limit|query|string|false|Maximum number of returned items. Default 25. Maximum 100.|

> Example responses

> 200 Response

```json
[
  {
    "id": "510ab12d-1689-4b2c-8a8d-275376f11077",
    "item": {
      "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
      "display_name": "Coffee"
    },
    "receiver": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "parent_request": "510ab12d-1689-4b2c-8a8d-275376f11078",
    "proof_of_debt": "510ab12d-1689-4b2c-8a8d-275376f11079",
    "proof_of_completion": "510ab12d-1689-4b2c-8a8d-275376f11076",
    "created_time": "2020-03-09T22:18:26.625Z",
    "claimed_time": "2020-03-09T22:18:26.625Z",
    "is_claimed": false
  }
]
```

<h3 id="get__api_iou_owe-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned list of favours a user owes.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to delete this request (you are not the owner of it)|None|

<h3 id="get__api_iou_owe-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier for an IOU|
|» item|[Item](#schemaitem)|false|none|none|
|»» id|string|false|none|Unique identifier of the item.|
|»» display_name|string|false|none|Current display name of the item.|
|» receiver|[User](#schemauser)|false|none|none|
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
|» parent_request|string|false|none|Unique identifier for an IOU|
|» proof_of_debt|string|false|none|Unique identifier for an image|
|» proof_of_completion|string|false|none|Unique identifier for an image|
|» created_time|string(date-time)|false|none|none|
|» claimed_time|string(date-time)|false|none|none|
|» is_claimed|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## post__api_iou_owe

> Code samples

```javascript
const inputBody = '{
  "username": "janesmith",
  "item": "510ab12d-1689-4b2c-8a8d-275376f11077"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/iou/owe',
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

`POST /api/iou/owe`

Record a new IOU that you are owed

> Body parameter

```json
{
  "username": "janesmith",
  "item": "510ab12d-1689-4b2c-8a8d-275376f11077"
}
```

<h3 id="post__api_iou_owe-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Updated user object|
|» username|body|string|false|Username of person who you owe|
|» item|body|string|false|Unique identifier of the item they owe you|

> Example responses

> 201 Response

```json
{
  "id": "510ab12d-1689-4b2c-8a8d-275376f11077"
}
```

<h3 id="post__api_iou_owe-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|IOU has been created.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

<h3 id="post__api_iou_owe-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier for the newly created IOU|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
</aside>

## put__api_iou_owe_{iouID}_complete

> Code samples

```javascript
const inputBody = '{
  "proof": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/iou/owe/{iouID}/complete',
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

`PUT /api/iou/owe/{iouID}/complete`

Mark an IOU as completed

> Body parameter

```yaml
proof: string

```

<h3 id="put__api_iou_owe_{iouid}_complete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Proof of completion for a given IOU|
|» proof|body|string(binary)|false|Image proof of debt|
|iouID|path|string|true|Unique identifier for the IOU|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "author": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "completed_by": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "proof_of_completion": "3533c832-2efa-4b37-be38-2f1c278704b8",
    "rewards": [
      {
        "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
        "display_name": "Coffee"
      }
    ],
    "details": "Clean the fridge",
    "created_time": "2020-03-09T22:18:26.625Z",
    "completion_time": "2020-03-09T22:18:26.625Z",
    "is_completed": false
  }
]
```

<h3 id="put__api_iou_owe_{iouid}_complete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request was understood, and the matching requests are returned (if any).|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="put__api_iou_owe_{iouid}_complete-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Request](#schemarequest)]|false|none|none|
|» id|string|false|none|Unique identifier of the request.|
|» author|[User](#schemauser)|false|none|none|
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
|» completed_by|[User](#schemauser)|false|none|none|
|» proof_of_completion|string|false|none|Unique identifier of the image proof of completion.|
|» rewards|[[Item](#schemaitem)]|false|none|Array of reward items being offered upon completion of this request.|
|»» id|string|false|none|Unique identifier of the item.|
|»» display_name|string|false|none|Current display name of the item.|
|» details|string|false|none|Details of the request (maximum 50 bytes).|
|» created_time|string(date-time)|false|none|Timestamp of when the request was created.|
|» completion_time|string(date-time)|false|none|Timestamp of when the request was completed.|
|» is_completed|boolean|false|none|Whether or not this request has been completed by a user.|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
userAuthenticated
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
|start|query|string|false|Starting row of the returned array. Default 0.|
|limit|query|string|false|Maximum number of returned items. Default 25. Maximum 100.|
|author|query|string|false|Filter based on request author.|
|search|query|string|false|Filter for requests whose details contain the provided string.|
|rewards|query|array[string]|false|Filter for requests that contain all these items as rewards (array of item PK's).|
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
    "author": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "completed_by": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "proof_of_completion": "3533c832-2efa-4b37-be38-2f1c278704b8",
    "rewards": [
      {
        "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
        "display_name": "Coffee"
      }
    ],
    "details": "Clean the fridge",
    "created_time": "2020-03-09T22:18:26.625Z",
    "completion_time": "2020-03-09T22:18:26.625Z",
    "is_completed": false
  }
]
```

<h3 id="get__api_requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request was understood, and the matching requests are returned (if any).|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="get__api_requests-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Request](#schemarequest)]|false|none|none|
|» id|string|false|none|Unique identifier of the request.|
|» author|[User](#schemauser)|false|none|none|
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
|» completed_by|[User](#schemauser)|false|none|none|
|» proof_of_completion|string|false|none|Unique identifier of the image proof of completion.|
|» rewards|[[Item](#schemaitem)]|false|none|Array of reward items being offered upon completion of this request.|
|»» id|string|false|none|Unique identifier of the item.|
|»» display_name|string|false|none|Current display name of the item.|
|» details|string|false|none|Details of the request (maximum 50 bytes).|
|» created_time|string(date-time)|false|none|Timestamp of when the request was created.|
|» completion_time|string(date-time)|false|none|Timestamp of when the request was completed.|
|» is_completed|boolean|false|none|Whether or not this request has been completed by a user.|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_requests

> Code samples

```javascript
const inputBody = '{
  "details": "Clean my fridge",
  "item": "2b4905a4-3e99-4ead-9257-a48bef738ec0"
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
  "details": "Clean my fridge",
  "item": "2b4905a4-3e99-4ead-9257-a48bef738ec0"
}
```

<h3 id="post__api_requests-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» details|body|string|true|Details of the request (what you are asking for), limited to 50 bytes.|
|» item|body|string|true|Unique identifier of the item being offered as a reward.|

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
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

<h3 id="post__api_requests-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier of the created request.|

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

Retrieve details about a single request.

<h3 id="get__api_request_{requestid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "author": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "completed_by": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "proof_of_completion": "3533c832-2efa-4b37-be38-2f1c278704b8",
  "rewards": [
    {
      "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
      "display_name": "Coffee"
    }
  ],
  "details": "Clean the fridge",
  "created_time": "2020-03-09T22:18:26.625Z",
  "completion_time": "2020-03-09T22:18:26.625Z",
  "is_completed": false
}
```

<h3 id="get__api_request_{requestid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request ID found and it's details returned.|[Request](#schemarequest)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The given request ID was not found.|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_request_{requestID}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/request/{requestID}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/request/{requestID}`

Delete a single request.

<h3 id="delete__api_request_{requestid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 400 Response

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}
```

<h3 id="delete__api_request_{requestid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request has been successfully deleted.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to delete this request (you are not the author of it).|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The given request ID was not found.|None|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_request_{requestID}_complete

> Code samples

```javascript
const inputBody = '{
  "proof": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/request/{requestID}/complete',
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

`PUT /api/request/{requestID}/complete`

Complete a request.

> Body parameter

```yaml
proof: string

```

<h3 id="put__api_request_{requestid}_complete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» proof|body|string(binary)|true|Image proof of the request completion.|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 400 Response

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}
```

<h3 id="put__api_request_{requestid}_complete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request successfully marked as complete.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The given request ID was not found.|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_request_{requestID}_rewards

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/request/{requestID}/rewards',
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

`GET /api/request/{requestID}/rewards`

Retrieve details about the request rewards on offer.

<h3 id="get__api_request_{requestid}_rewards-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 200 Response

```json
[
  {
    "id": "1ce5d3cc-cb15-4050-9f0f-95d089721ed8",
    "giver": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "item": {
      "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
      "display_name": "Coffee"
    }
  }
]
```

<h3 id="get__api_request_{requestid}_rewards-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned list of rewards.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<h3 id="get__api_request_{requestid}_rewards-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Reward](#schemareward)]|false|none|none|
|» id|string|false|none|Unique identifier of reward (also the ID of the IOU it becomes).|
|» giver|[User](#schemauser)|false|none|none|
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
|» item|[Item](#schemaitem)|false|none|none|
|»» id|string|false|none|Unique identifier of the item.|
|»» display_name|string|false|none|Current display name of the item.|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_request_{requestID}_rewards

> Code samples

```javascript
const inputBody = '{
  "item": "2b4905a4-3e99-4ead-9257-a48bef738ec0"
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

Create a new reward for this request.

> Body parameter

```json
{
  "item": "2b4905a4-3e99-4ead-9257-a48bef738ec0"
}
```

<h3 id="post__api_request_{requestid}_rewards-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» item|body|string|true|Unique identifier of the item being offered as a reward.|
|requestID|path|string|true|Unique identifier of a given request.|

> Example responses

> 201 Response

```json
{
  "id": "424195ef-eb69-492e-bc5a-741d664a99aa"
}
```

<h3 id="post__api_request_{requestid}_rewards-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Reward was successfully added.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|

<h3 id="post__api_request_{requestid}_rewards-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|Unique identifier of the created reward (also the owed IOU).|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_request_{requestID}_reward_{rewardID}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/request/{requestID}/reward/{rewardID}',
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

`GET /api/request/{requestID}/reward/{rewardID}`

Retrieve details about a specific request rewards on offer.

<h3 id="get__api_request_{requestid}_reward_{rewardid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|
|rewardID|path|string|true|Unique identifier of a given request reward.|

> Example responses

> 200 Response

```json
{
  "id": "1ce5d3cc-cb15-4050-9f0f-95d089721ed8",
  "giver": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "item": {
    "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
    "display_name": "Coffee"
  }
}
```

<h3 id="get__api_request_{requestid}_reward_{rewardid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned details of a specific request reward.|[Reward](#schemareward)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_request_{requestID}_reward_{rewardID}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/request/{requestID}/reward/{rewardID}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/request/{requestID}/reward/{rewardID}`

Delete a single request reward.

<h3 id="delete__api_request_{requestid}_reward_{rewardid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestID|path|string|true|Unique identifier of a given request.|
|rewardID|path|string|true|Unique identifier of a given request reward.|

> Example responses

> 400 Response

```json
{
  "errors": [
    "Reason why request was invalid"
  ]
}
```

<h3 id="delete__api_request_{requestid}_reward_{rewardid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Request reward has been successfully deleted.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The HTTP request was invalid or incorrectly formatted.|[badRequest](#schemabadrequest)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not authenticated.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorised to delete this reward (you are not the one offering it, or the request is already complete).|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The given request ID or reward ID was not found.|None|

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
|»» username|string|false|none|Unique username of the user|
|»» display_name|string|false|none|Current display name of the user|
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

<h1 id="ioweyou-tech-image">Image</h1>

## get__api_image_{imagePK}

> Code samples

```javascript

const headers = {
  'Accept':'image/*'
};

fetch('/api/image/{imagePK}',
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

`GET /api/image/{imagePK}`

Retrieve an image.

<h3 id="get__api_image_{imagepk}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|imagePK|path|string|true|Unique identifier for the image.|

> Example responses

> 200 Response

<h3 id="get__api_image_{imagepk}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Image found and returned.|string|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Image not found.|None|

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
|username|string|false|none|Unique username of the user|
|display_name|string|false|none|Current display name of the user|

<h2 id="tocS_IOU">IOU</h2>
<!-- backwards compatibility -->
<a id="schemaiou"></a>
<a id="schema_IOU"></a>
<a id="tocSiou"></a>
<a id="tocsiou"></a>

```json
{
  "id": "510ab12d-1689-4b2c-8a8d-275376f11077",
  "item": {
    "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
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
    "id": "string",
    "author": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "completed_by": {
      "username": "jsmith",
      "display_name": "John Smith"
    },
    "proof_of_completion": "3533c832-2efa-4b37-be38-2f1c278704b8",
    "rewards": [
      {
        "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
        "display_name": "Coffee"
      }
    ],
    "details": "Clean the fridge",
    "created_time": "2020-03-09T22:18:26.625Z",
    "completion_time": "2020-03-09T22:18:26.625Z",
    "is_completed": false
  },
  "proof_of_debt": "510ab12d-1689-4b2c-8a8d-275376f11071",
  "proof_of_completion": "510ab12d-1689-4b2c-8a8d-275376f11079",
  "created_time": "2020-03-09T22:18:26.625Z",
  "claimed_time": "2020-03-09T22:18:26.625Z",
  "is_claimed": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Unique identifier for an IOU|
|item|[Item](#schemaitem)|true|none|none|
|giver|[User](#schemauser)|true|none|none|
|receiver|[User](#schemauser)|false|none|none|
|parent_request|[Request](#schemarequest)|false|none|none|
|proof_of_debt|string|false|none|Unique identifier for an image|
|proof_of_completion|string|false|none|Unique identifier for an image|
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
  "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
  "display_name": "Coffee"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier of the item.|
|display_name|string|false|none|Current display name of the item.|

<h2 id="tocS_Request">Request</h2>
<!-- backwards compatibility -->
<a id="schemarequest"></a>
<a id="schema_Request"></a>
<a id="tocSrequest"></a>
<a id="tocsrequest"></a>

```json
{
  "id": "string",
  "author": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "completed_by": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "proof_of_completion": "3533c832-2efa-4b37-be38-2f1c278704b8",
  "rewards": [
    {
      "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
      "display_name": "Coffee"
    }
  ],
  "details": "Clean the fridge",
  "created_time": "2020-03-09T22:18:26.625Z",
  "completion_time": "2020-03-09T22:18:26.625Z",
  "is_completed": false
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier of the request.|
|author|[User](#schemauser)|false|none|User who created the request.|
|completed_by|[User](#schemauser)|false|none|User who completed the request.|
|proof_of_completion|string|false|none|Unique identifier of the image proof of completion.|
|rewards|[[Item](#schemaitem)]|false|none|Array of reward items being offered upon completion of this request.|
|details|string|false|none|Details of the request (maximum 50 bytes).|
|created_time|string(date-time)|false|none|Timestamp of when the request was created.|
|completion_time|string(date-time)|false|none|Timestamp of when the request was completed.|
|is_completed|boolean|false|none|Whether or not this request has been completed by a user.|

<h2 id="tocS_Reward">Reward</h2>
<!-- backwards compatibility -->
<a id="schemareward"></a>
<a id="schema_Reward"></a>
<a id="tocSreward"></a>
<a id="tocsreward"></a>

```json
{
  "id": "1ce5d3cc-cb15-4050-9f0f-95d089721ed8",
  "giver": {
    "username": "jsmith",
    "display_name": "John Smith"
  },
  "item": {
    "id": "a16ed6ef-c666-46d7-93b5-e4612cce923e",
    "display_name": "Coffee"
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier of reward (also the ID of the IOU it becomes).|
|giver|[User](#schemauser)|false|none|User who is offering this reward.|
|item|[Item](#schemaitem)|false|none|Item being offered as an award.|

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

