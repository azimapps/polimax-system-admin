# Order Endpoints

## Enums

| Enum | Values | Description |
|------|--------|-------------|
| `material` | `bopp`, `cpp`, `pe`, `pet` | Material turi |
| `sub_material` | `prazrachniy`, `metal`, `jemchuk`, `jemchuk_metal`, `beliy` | Sub-material turi |
| `currency` | `uzs`, `usd`, `rub`, `eur` | Narx valyutasi |
| `status` | `in_progress`, `finished` | Buyurtma holati |
| `vtulka` | `76`, `152` | Втулка размери (мм) |
| `napravlenie` | `type_1`, `type_2`, `type_3`, `type_4` | Йўналиш (направление) |

## Staff Link

- `manager_id` references `staff.id`
- `manager_id` must point to active staff with `type = "crm"`

---

### `POST /orders`

**Request**

```json
{
  "order_number": "ORD-001",
  "date": "2026-02-15T10:00:00",
  "title": "Nestle suv etiketka",
  "client_id": 1,
  "quantity_kg": 500,
  "material": "bopp",
  "sub_material": "prazrachniy",
  "film_thickness": 20,
  "film_width": 300,
  "cylinder_length": 200,
  "cylinder_count": 6,
  "cylinder_aylanasi": 400,
  "start_date": "2026-02-16T08:00:00",
  "end_date": "2026-02-20T18:00:00",
  "price_per_kg": 3.5,
  "price_currency": "usd",
  "manager_id": 5,
  "status": "in_progress",
  "vtulka": "76",
  "napravlenie": "type_1"
}
```

**Response `201`**

```json
{
  "id": 1,
  "version": 1,
  "order_number": "ORD-001",
  "date": "2026-02-15T10:00:00",
  "title": "Nestle suv etiketka",
  "client_id": 1,
  "quantity_kg": 500,
  "material": "bopp",
  "sub_material": "prazrachniy",
  "film_thickness": 20,
  "film_width": 300,
  "cylinder_length": 200,
  "cylinder_count": 6,
  "cylinder_aylanasi": 400,
  "start_date": "2026-02-16T08:00:00",
  "end_date": "2026-02-20T18:00:00",
  "price_per_kg": 3.5,
  "price_currency": "usd",
  "manager_id": 5,
  "status": "in_progress",
  "vtulka": "76",
  "napravlenie": "type_1",
  "created_at": "2026-02-15T10:00:00",
  "updated_at": "2026-02-15T10:00:00",
  "deleted_at": null,
  "archived_at": null,
  "created_by": 1,
  "archived_by": null,
  "previous_id": null
}
```

---

### `GET /orders`

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by `in_progress` or `finished` |
| `material` | string | Filter by material type |
| `client_id` | int | Filter by client |
| `manager_id` | int | Filter by CRM manager (staff id) |
| `q` | string | Search in title |

**Examples**

```
GET /orders
GET /orders?status=in_progress
GET /orders?material=bopp
GET /orders?client_id=1
GET /orders?manager_id=5
GET /orders?status=in_progress&material=bopp
GET /orders?q=Nestle
```

**Response `200`**

```json
[
  {
    "id": 1,
    "version": 1,
    "order_number": "ORD-001",
    "date": "2026-02-15T10:00:00",
    "title": "Nestle suv etiketka",
    "client_id": 1,
    "quantity_kg": 500,
    "material": "bopp",
    "status": "in_progress"
  }
]
```

---

### `GET /orders/{id}`

**Response `200`** - full order object

**Response `404`** - `{"detail": "Order not found"}`

---

### `PUT /orders/{id}`

**Request**

```json
{
  "quantity_kg": 600,
  "status": "finished"
}
```

**Response `200`**

```json
{
  "id": 2,
  "version": 2,
  "order_number": "ORD-001",
  "date": "2026-02-15T10:00:00",
  "title": "Nestle suv etiketka",
  "quantity_kg": 600,
  "status": "finished",
  "previous_id": 1
}
```

---

### `DELETE /orders/{id}`

**Response `200`** - `{"detail": "Order deleted"}`

---

### `GET /orders/archived`

Returns only archived orders (not old versions from edits).

**Response `200`**

```json
[
  {
    "id": 1,
    "order_number": "ORD-001",
    "title": "Nestle suv etiketka",
    "deleted_at": "2026-02-15T12:00:00",
    "archived_at": "2026-02-15T12:00:00",
    "created_by": 1,
    "archived_by": 2
  }
]
```

---

### `POST /orders/{id}/restore`

**Response `200`** - restored order object

**Response `404`** - `{"detail": "Order not found"}`

---

### `GET /orders/{id}/history`

**Response `200`**

```json
[
  {"id": 2, "version": 2, "quantity_kg": 600, "status": "finished", "deleted_at": null, "previous_id": 1},
  {"id": 1, "version": 1, "quantity_kg": 500, "status": "in_progress", "deleted_at": "...", "previous_id": null}
]
```

---

### `POST /orders/{id}/revert/{version}`

**Response `200`** - reverted order object

**Response `404`** - `{"detail": "Version not found"}`
