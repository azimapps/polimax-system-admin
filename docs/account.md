# Account Endpoints

### `PUT /auth/profile`

Update current account's fullname and avatar.

**Request**

```json
{
  "fullname": "Solih Rahimov",
  "avatar_url": "https://bucket.example.com/new-avatar.jpg"
}
```

**Response `200`** - updated account object

---

### `PUT /auth/password`

Update current account's password.

**Request**

```json
{
  "old_password": "current_secret",
  "new_password": "new_secret123"
}
```

**Response `200`** - `{"detail": "Password updated"}`

**Response `401`** - `{"detail": "Invalid old password"}`

---

### `POST /accounts`

**Request (with staff_id)**

```json
{
  "login": "ahmed",
  "password": "secret123",
  "role": "crm",
  "staff_id": 5
}
```

**Request (CEO without staff_id)**

```json
{
  "login": "ceo",
  "password": "secret123",
  "role": "ceo",
  "fullname": "Solih Rahimov",
  "avatar_url": "https://bucket.example.com/avatar.jpg"
}
```

**Response `201`**

```json
{
  "id": 1,
  "version": 1,
  "login": "ahmed",
  "role": "crm",
  "fullname": null,
  "avatar_url": null,
  "staff_id": 5,
  "session_token": null,
  "last_login_at": null,
  "created_at": "2026-02-05T10:00:00",
  "updated_at": "2026-02-05T10:00:00",
  "deleted_at": null,
  "archived_at": null,
  "created_by": 1,
  "archived_by": null,
  "previous_id": null
}
```

---

### `GET /accounts`

**Query Parameters**

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| `q`       | string | Search by login    |

**Response `200`**

```json
[
  {
    "id": 1,
    "version": 1,
    "login": "admin",
    "role": "ceo",
    "staff_id": null,
    "last_login_at": "2026-02-05T10:00:00"
  }
]
```

---

### `GET /accounts/{id}`

**Response `200`** - full account object

**Response `404`** - `{"detail": "Account not found"}`

---

### `PUT /accounts/{id}`

**Request**

```json
{
  "login": "ahmed_new",
  "role": "orders_planning"
}
```

**Response `200`**

```json
{
  "id": 2,
  "version": 2,
  "login": "ahmed_new",
  "role": "orders_planning",
  "previous_id": 1
}
```

---

### `DELETE /accounts/{id}`

**Response `200`** - `{"detail": "Account deleted"}`

---

### `GET /accounts/archived`

Returns only truly deleted accounts (not old versions from edits).

**Query Parameters**

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| `q`       | string | Search by login    |

**Response `200`**

```json
[
  {
    "id": 1,
    "login": "ahmed",
    "role": "crm",
    "deleted_at": "2026-02-05T12:00:00",
    "archived_at": "2026-02-05T12:00:00",
    "created_by": 1,
    "archived_by": 2
  }
]
```

---

### `POST /accounts/{id}/restore`

**Response `200`** - restored account object

**Response `404`** - `{"detail": "Account not found"}`

---

### `GET /accounts/{id}/history`

**Response `200`**

```json
[
  {"id": 2, "version": 2, "login": "ahmed_new", "role": "orders_planning", "deleted_at": null, "previous_id": 1},
  {"id": 1, "version": 1, "login": "ahmed", "role": "crm", "deleted_at": "...", "previous_id": null}
]
```

---

### `POST /accounts/{id}/revert/{version}`

**Response `200`** - reverted account object

**Response `404`** - `{"detail": "Version not found"}`

---

### `GET /accounts/{id}/login-history`

**Response `200`**

```json
[
  {
    "id": 1,
    "account_id": 1,
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "device": "Desktop",
    "browser": "Chrome 120",
    "os": "Windows 11",
    "country": "Uzbekistan",
    "city": "Tashkent",
    "success": 1,
    "logged_in_at": "2026-02-05T10:00:00"
  },
  {
    "id": 2,
    "account_id": 1,
    "ip_address": "45.33.22.11",
    "device": "Mobile",
    "browser": "Safari",
    "os": "iOS 17",
    "country": "Uzbekistan",
    "city": "Angren",
    "success": 0,
    "logged_in_at": "2026-02-05T15:00:00"
  }
]
```
