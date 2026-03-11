# Sushka (Drying Step)

## What is Sushka?

Sushka = **drying**. It's a countdown step — material goes in, dries, comes out. No materials used, no kg lost.

**Key rule:** `kg_in == kg_out` always.

---

## Where it appears

Sushka can appear **multiple times** in a pipeline:

| Pipeline | Steps |
|----------|-------|
| `pechat_first` | pechat → **sushka** → laminatsiya → **sushka** → reska → tayyor |
| `full_cycle` | reska → pechat → **sushka** → laminatsiya → **sushka** → reska → tayyor |
| `no_final_reska` | reska → pechat → **sushka** → laminatsiya → **sushka** → tayyor |

---

## Endpoint

No separate endpoint. Use the standard production log:

```
POST /material-usage/production-log
Authorization: Bearer <token>
```

---

## Validation Rules

When current step is `sushka`, the backend enforces **4 strict rules**:

| # | Rule | Why |
|---|------|-----|
| 1 | `kg_produced` must equal `kg_received` | No loss in drying |
| 2 | `kg_waste` must be `0` or `null` | No waste allowed |
| 3 | `kg_ostatok` must be `0` or `null` | No leftover allowed |
| 4 | `materials` must be empty or not sent | No ombor materials used |

---

## Request Example

Step received 100 kg → must produce exactly 100 kg:

```json
{
  "plan_item_id": 234,
  "kg_produced": 100,
  "meters_produced": 0,
  "work_type": "sushka",
  "send": {
    "to_brigada_id": 5,
    "kg_sent": 100,
    "meters_sent": 0,
    "kg_waste": 0,
    "kg_ostatok": 0
  }
}
```

**Do NOT send `materials`** — it will be rejected.

---

## Errors

| Code | Message | Cause |
|------|---------|-------|
| `422` | `Sushka: kg_produced must equal kg_received` | kg_produced ≠ kg_received |
| `422` | `Sushka: kg_waste must be 0` | kg_waste > 0 |
| `422` | `Sushka: kg_ostatok must be 0` | kg_ostatok > 0 |
| `422` | `Sushka: no materials allowed` | materials array is not empty |

---

## Frontend Notes

When the current step is `sushka`:

- **Auto-fill** `kg_produced` = `kg_received` (user shouldn't change it)
- **Disable** kg_waste field (or set to 0)
- **Disable** kg_ostatok field (or set to 0)
- **Hide** materials section (no ombor items needed)
- Only thing user needs to pick: `to_brigada_id` and `kg_sent`
