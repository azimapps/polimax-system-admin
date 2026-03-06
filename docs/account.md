# Plan Item — Full API Reference

## Overview

A **Plan Item** connects an **Order** to a **Brigada + Machine** with dates and a production pipeline. When `plan_type` is set, pipeline **steps** are auto-generated.

**Role required:** `accountant` (CRUD) | brigada leader (read own)

---

## Model

```
PlanItem:
  id              int          auto
  version         int          auto (versioned updates)
  order_id        int          → orders.id (one active plan item per order)
  brigada_id      int          → brigadas.id
  machine_id      int          → stanoklar.id
  start_date      datetime     when to start
  end_date        datetime     deadline
  status          enum         "in_progress" | "finished"
  plan_type       enum | null  "pechat_first" | "full_cycle" | "no_final_reska"
  quantity_kg     float | null target production amount in kg
```

## Enums

### `status`
| Value | Description |
|-------|-------------|
| `in_progress` | Ишлаб чиқариш жараёнида |
| `finished` | Тугаллаган |

### `plan_type`
| Value | Pipeline steps | Description |
|-------|---------------|-------------|
| `pechat_first` | pechat → sushka → laminatsiya → sushka → reska → tayyor | Плёнка кесилган, печатдан бошлаш |
| `full_cycle` | reska → pechat → sushka → laminatsiya → sushka → reska → tayyor | Тўлиқ цикл |
| `no_final_reska` | reska → pechat → sushka → laminatsiya → sushka → tayyor | Рулонда юборилади, охирги реска йўқ |

---

## Endpoints

---

### `POST /plan-items` `201`

Creates a plan item. If `plan_type` is set, pipeline steps are auto-generated.

**Role:** `accountant`

**Request**

```json
{
  "order_id": 1,
  "brigada_id": 5,
  "machine_id": 3,
  "start_date": "2026-03-01T08:00:00",
  "end_date": "2026-03-05T18:00:00",
  "status": "in_progress",
  "plan_type": "full_cycle",
  "quantity_kg": 500.0
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | int | yes | Буюртма. Битта буюртмага битта актив план |
| `brigada_id` | int | yes | Бригада |
| `machine_id` | int | yes | Станок |
| `start_date` | datetime | yes | Бошланиш санаси |
| `end_date` | datetime | yes | Тугаш санаси (>= start_date) |
| `status` | string | no | Default: `"in_progress"` |
| `plan_type` | string | no | Пайплайн тури. Қўйилса, степлар автоматик яратилади |
| `quantity_kg` | float | no | Ишлаб чиқариш миқдори (кг). 1-степга `kg_received` сифатида ёзилади |

**Response `201`**

```json
{
  "id": 10,
  "version": 1,
  "order_id": 1,
  "brigada_id": 5,
  "machine_id": 3,
  "start_date": "2026-03-01T08:00:00",
  "end_date": "2026-03-05T18:00:00",
  "status": "in_progress",
  "plan_type": "full_cycle",
  "quantity_kg": 500.0,
  "created_at": "2026-03-01T08:00:00",
  "updated_at": "2026-03-01T08:00:00",
  "deleted_at": null,
  "archived_at": null,
  "created_by": 1,
  "archived_by": null,
  "previous_id": null
}
```

**Auto-generated steps (full_cycle example):**

| step_number | step_type | status | brigada_id | machine_id | kg_received |
|-------------|-----------|--------|------------|------------|-------------|
| 1 | reska | `in_progress` | 5 (from plan item) | 3 (from plan item) | 500.0 (from quantity_kg) |
| 2 | pechat | `pending` | null | null | null |
| 3 | sushka | `pending` | null | null | null |
| 4 | laminatsiya | `pending` | null | null | null |
| 5 | sushka | `pending` | null | null | null |
| 6 | reska | `pending` | null | null | null |
| 7 | tayyor | `pending` | null | null | null |

**Validation errors:**

| Error | Description |
|-------|-------------|
| `422` "Order #1 already has an active plan item" | Битта буюртмага фақат битта актив план бўлади |
| `422` "order_id does not reference an active order" | Буюртма топилмади |
| `422` "brigada_id does not reference an active brigada" | Бригада топилмади |
| `422` "machine_id does not reference an active machine" | Станок топилмади |
| `422` "brigada.machine_type must match machine.type" | Бригада тури станок турига мос эмас |
| `422` "end_date must be >= start_date" | Тугаш санаси бошланишдан олдин |

---

### `GET /plan-items`

List all active plan items.

**Role:** `accountant`

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `in_progress` ёки `finished` |
| `order_id` | int | Буюртма бўйича филтр |
| `brigada_id` | int | Бригада бўйича филтр |
| `machine_id` | int | Станок бўйича филтр |
| `start_date_from` | datetime | start_date >= |
| `start_date_to` | datetime | start_date <= |
| `end_date_from` | datetime | end_date >= |
| `end_date_to` | datetime | end_date <= |
| `limit` | int | Default `50`, max `200` |
| `offset` | int | Default `0` |

**Response `200`**

```json
[
  {
    "id": 10,
    "version": 1,
    "order_id": 1,
    "brigada_id": 5,
    "machine_id": 3,
    "start_date": "2026-03-01T08:00:00",
    "end_date": "2026-03-05T18:00:00",
    "status": "in_progress",
    "plan_type": "full_cycle",
    "quantity_kg": 500.0,
    "created_at": "...",
    "updated_at": "...",
    "deleted_at": null,
    "archived_at": null,
    "created_by": 1,
    "archived_by": null,
    "previous_id": null
  }
]
```

---

### `GET /plan-items/{id}`

Returns detailed plan item with nested **order**, **brigada**, and **machine** objects.

**Role:** `accountant` | brigada leader (own items only)

**Response `200`**

```json
{
  "id": 10,
  "version": 1,
  "order_id": 1,
  "brigada_id": 5,
  "machine_id": 3,
  "start_date": "2026-03-01T08:00:00",
  "end_date": "2026-03-05T18:00:00",
  "status": "in_progress",
  "plan_type": "full_cycle",
  "quantity_kg": 500.0,
  "created_at": "...",
  "updated_at": "...",
  "deleted_at": null,
  "archived_at": null,
  "created_by": 1,
  "archived_by": null,
  "previous_id": null,
  "order": {
    "id": 1,
    "order_number": "ORD-001",
    "title": "Nestle suv etiketka",
    "quantity_kg": 500.0,
    "material": "bopp",
    "sub_material": "prazrachniy",
    "film_thickness": 20.0,
    "film_width": 300.0,
    "cylinder_length": 200.0,
    "cylinder_count": 6,
    "cylinder_aylanasi": 400.0,
    "price_per_kg": 3.5,
    "price_currency": "usd",
    "vtulka": "76",
    "napravlenie": "type_1",
    "status": "in_progress"
  },
  "brigada": {
    "id": 5,
    "name": "Smena 1",
    "leader": "Ali Valiyev",
    "machine_id": 3,
    "machine_type": "pechat"
  },
  "machine": {
    "id": 3,
    "country_code": "CN",
    "name": "Heidelberg Speedmaster",
    "type": "pechat"
  }
}
```

---

### `PUT /plan-items/{id}`

Partial update. Creates a new version, soft-deletes the previous.

**Role:** `accountant`

**Request**

```json
{
  "quantity_kg": 600.0,
  "end_date": "2026-03-10T18:00:00"
}
```

All fields are optional. Only send what you want to change.

**Response `200`** — updated PlanItemBasicResponse (new version, new id).

---

### `DELETE /plan-items/{id}`

Archives the plan item.

**Role:** `accountant`

**Response `200`** — `{"detail": "Plan item deleted"}`

---

### `POST /plan-items/{id}/restore`

Restores an archived plan item.

**Response `200`** — PlanItemBasicResponse

---

### `GET /plan-items/archived`

Same filters as `GET /plan-items`. Returns only archived items.

---

### `GET /plan-items/{id}/history`

Returns all versions from newest to oldest.

**Response `200`**

```json
[
  {"id": 11, "version": 2, "quantity_kg": 600.0, "status": "in_progress", "previous_id": 10},
  {"id": 10, "version": 1, "quantity_kg": 500.0, "status": "in_progress", "previous_id": null, "deleted_at": "..."}
]
```

---

### `POST /plan-items/{id}/revert/{version}`

Reverts to a historical version.

**Response `200`** — PlanItemBasicResponse

---

## Brigada Leader Endpoints

These work for **any authenticated brigada leader** — no `accountant` role needed.

---

### `GET /plan-items/my-brigada`

Returns plan items assigned to the caller's brigada.

**Query:** same filters as `GET /plan-items` (except `brigada_id` — auto-set).

```
GET /plan-items/my-brigada
GET /plan-items/my-brigada?status=in_progress
```

**Response `200`** — `[PlanItemBasicResponse]`

---

### `GET /material-usage/my-steps`

Returns all pipeline steps assigned to the caller's brigada. **This is how a brigada discovers what work is waiting for them.**

```
GET /material-usage/my-steps
GET /material-usage/my-steps?status=in_progress
```

Default: returns `pending` + `in_progress` steps.

**Response `200`**

```json
[
  {
    "id": 748,
    "plan_item_id": 205,
    "step_number": 1,
    "step_type": "pechat",
    "status": "in_progress",
    "brigada_id": 93,
    "machine_id": 1,
    "started_at": "2026-03-05T14:51:51",
    "kg_received": 122.0,
    "kg_produced": null,
    "meters_produced": null,
    "notes": null,
    "created_at": "...",
    "updated_at": "...",
    "plan_item": {
      "id": 205,
      "order_id": 2,
      "order_title": "Nestle suv etiketka",
      "plan_type": "pechat_first",
      "status": "in_progress"
    }
  }
]
```

| Field | Description |
|-------|-------------|
| `step_type` | `reska`, `pechat`, `sushka`, `laminatsiya`, `tayyor` |
| `status` | `pending`, `in_progress`, `completed` |
| `kg_received` | Қанча кг келган (1-степ учун = `quantity_kg`) |
| `plan_item.order_title` | Буюртма номи |
| `plan_item.plan_type` | Пайплайн тури |

---

### `GET /material-usage/plan-item/{plan_item_id}/steps`

Returns all steps for a specific plan item (ordered by step_number).

**Response `200`**

```json
[
  {
    "id": 748,
    "plan_item_id": 205,
    "step_number": 1,
    "step_type": "pechat",
    "status": "completed",
    "brigada_id": 93,
    "machine_id": 1,
    "started_at": "2026-03-05T08:00:00",
    "completed_at": "2026-03-05T14:00:00",
    "kg_received": 500.0,
    "kg_produced": 480.0,
    "kg_waste": 10.0,
    "kg_ostatok": 10.0,
    "meters_produced": 3500.0,
    "notes": null,
    "created_at": "...",
    "updated_at": "..."
  },
  {
    "id": 749,
    "plan_item_id": 205,
    "step_number": 2,
    "step_type": "sushka",
    "status": "in_progress",
    "brigada_id": 8,
    "machine_id": 5,
    "started_at": "2026-03-05T15:00:00",
    "completed_at": null,
    "kg_received": 480.0,
    "kg_produced": null,
    "kg_waste": null,
    "kg_ostatok": null,
    "meters_produced": null,
    "notes": null,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### Step fields

| Field | Description |
|-------|-------------|
| `step_number` | Тартиб рақами (1, 2, 3...) |
| `step_type` | `reska`, `pechat`, `sushka`, `laminatsiya`, `tayyor` |
| `status` | `pending` → `in_progress` → `completed` |
| `brigada_id` | Қайси бригада бажаряпти |
| `machine_id` | Қайси станокда |
| `kg_received` | Олдинги степдан қанча кг олинган |
| `kg_produced` | Қанча кг ишлаб чиқарилган |
| `kg_waste` | Чиқинди (кг) |
| `kg_ostatok` | Остаток (кг) |
| `meters_produced` | Қанча метр ишлаб чиқарилган |
| `started_at` | Бошланган вақт |
| `completed_at` | Тугалланган вақт |

---

## Step Type Rules

| Step | Materials from ombor? | kg loss? | Special rules |
|------|----------------------|----------|---------------|
| `reska` | Plyonka (if first) | Yes (waste + ostatok) | — |
| `pechat` | Kraska | Yes (waste + ostatok) | — |
| `sushka` | **No** | **No** (kg_in = kg_out) | kg_produced must equal kg_received. No waste, no ostatok, no materials |
| `laminatsiya` | Kley + plyonka | kg_out **>** kg_in | Layers added from ombor |
| `tayyor` | No | No | Auto-creates OmborItem in tayyor_angren |

---

## Production Flow

Brigada completes a step and sends material to the next step via:

`POST /material-usage/production-log`

```json
{
  "plan_item_id": 205,
  "meters_produced": 3500.0,
  "kg_produced": 480.0,
  "materials": [
    {
      "ombor_transaction_id": 56,
      "used_amount": 28.0,
      "remainder_destination": "machine_warehouse"
    }
  ],
  "send": {
    "to_brigada_id": 8,
    "kg_sent": 480.0,
    "meters_sent": 3500.0,
    "kg_waste": 10.0,
    "kg_ostatok": 10.0,
    "notes": "Sushkaga yuborildi"
  }
}
```

**What happens:**
1. Current step → `completed`
2. Next step → `in_progress` (brigada + machine assigned from `to_brigada_id`)
3. Next step `kg_received += kg_sent` (partial sends accumulate)
4. `ProductionSend` record created
5. `ProductionLog` created for each brigada member
6. If materials provided → `MaterialUsage` records created
7. If next step is `tayyor` → OmborItem auto-created in tayyor_angren, plan item finishes when all steps completed

---

## Response Types Summary

### PlanItemBasicResponse (list/create/update)

```json
{
  "id": 10,
  "version": 1,
  "order_id": 1,
  "brigada_id": 5,
  "machine_id": 3,
  "start_date": "datetime",
  "end_date": "datetime",
  "status": "in_progress",
  "plan_type": "full_cycle",
  "quantity_kg": 500.0,
  "created_at": "datetime",
  "updated_at": "datetime",
  "deleted_at": null,
  "archived_at": null,
  "created_by": 1,
  "archived_by": null,
  "previous_id": null
}
```

### PlanItemDetailResponse (GET /plan-items/{id})

```json
{
  ...PlanItemBasicResponse,
  "order": { OrderResponse } | null,
  "brigada": {
    "id": 5,
    "name": "Smena 1",
    "leader": "Ali Valiyev",
    "machine_id": 3,
    "machine_type": "pechat"
  } | null,
  "machine": {
    "id": 3,
    "country_code": "CN",
    "name": "Heidelberg Speedmaster",
    "type": "pechat"
  } | null
}
```
