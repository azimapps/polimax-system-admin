# Client Endpoints

---

### `POST /clients`

**Request**

```json
{
  "fullname": "Rustam Zokirov",
  "phone_number": "+998901234567",
  "company": "SamPlast LLC",
  "notes": "VIP client",
  "profile_url": "https://bucket.example.com/profile.jpg",
  "image_urls": [
    "https://bucket.example.com/img1.jpg",
    "https://bucket.example.com/img2.jpg"
  ]
}
```

**Response `201`**

```json
{
  "id": 1,
  "version": 1,
  "fullname": "Rustam Zokirov",
  "phone_number": "+998901234567",
  "company": "SamPlast LLC",
  "notes": "VIP client",
  "profile_url": "https://bucket.example.com/profile.jpg",
  "image_urls": [
    "https://bucket.example.com/img1.jpg",
    "https://bucket.example.com/img2.jpg"
  ],
  "created_at": "2026-02-05T10:00:00",
  "updated_at": "2026-02-05T10:00:00",
  "deleted_at": null,
  "previous_id": null
}
```

---

### `GET /clients`

**Response `200`**

```json
[
  {
    "id": 1,
    "version": 1,
    "fullname": "Rustam Zokirov",
    "phone_number": "+998901234567",
    "company": "SamPlast LLC"
  }
]
```

---

### `GET /clients/{id}`

**Response `200`** - full client object

**Response `404`** - `{"detail": "Client not found"}`

---

### `PUT /clients/{id}`

**Request**

```json
{
  "company": "SamPlast Group",
  "notes": "VIP client, priority delivery"
}
```

**Response `200`**

```json
{
  "id": 2,
  "version": 2,
  "fullname": "Rustam Zokirov",
  "company": "SamPlast Group",
  "notes": "VIP client, priority delivery",
  "previous_id": 1
}
```

---

### `DELETE /clients/{id}`

**Response `200`** - `{"detail": "Client deleted"}`

---

### `GET /clients/archived`

**Response `200`**

```json
[
  {
    "id": 1,
    "fullname": "Rustam Zokirov",
    "company": "SamPlast LLC",
    "deleted_at": "2026-02-05T12:00:00"
  }
]
```

---

### `POST /clients/{id}/restore`

**Response `200`** - restored client object

**Response `404`** - `{"detail": "Client not found"}`

---

### `GET /clients/{id}/history`

**Response `200`**

```json
[
  {"id": 2, "version": 2, "fullname": "Rustam Zokirov", "company": "SamPlast Group", "deleted_at": null, "previous_id": 1},
  {"id": 1, "version": 1, "fullname": "Rustam Zokirov", "company": "SamPlast LLC", "deleted_at": "...", "previous_id": null}
]
```

---

### `POST /clients/{id}/revert/{version}`

**Response `200`** - reverted client object

**Response `404`** - `{"detail": "Version not found"}`
