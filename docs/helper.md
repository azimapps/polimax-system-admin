# Helper Endpoints

---

### `POST /upload`

Upload an image, get back the URL. Use this URL for avatar, logo, gallery fields.

**Headers:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | Image file (jpg, png, etc.) |

**Response `200`**

```json
{
  "url": "https://t3.storageapi.dev/customizable-tortellini-j-fwre/uploads/abc123.jpg"
}
```

---

### How to use

1. Upload image → get `url`
2. Use `url` in create/update requests

**Example: create staff with avatar**

```
POST /upload        → {"url": "https://...avatar.jpg"}
POST /upload        → {"url": "https://...img1.jpg"}
POST /upload        → {"url": "https://...img2.jpg"}

POST /staff
{
  "fullname": "Ali",
  "type": "crm",
  "avatar_url": "https://...avatar.jpg",
  "image_gallery_urls": ["https://...img1.jpg", "https://...img2.jpg"],
  "fixed_salary": 10000000
}
```

**Example: update partner logo**

```
POST /upload        → {"url": "https://...logo.jpg"}

PUT /partners/1
{
  "logo_url": "https://...logo.jpg"
}
```
