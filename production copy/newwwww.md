# Recent Changes

## Sushka Timer (2026-03-06)

When sending to a sushka step, you must now provide `sushka_end_at` — the datetime when drying finishes. The next brigada cannot complete sushka until the timer expires.

**Send payload (when next step is sushka):**
```json
{
  "send": {
    "to_brigada_id": 5,
    "kg_sent": 100,
    "sushka_end_at": "2026-03-07T14:00:00"
  }
}
```

- `sushka_end_at` is **required** when sending to sushka step
- Completing sushka before timer → `422 "Sushka not ready yet"`
- `sushka_end_at` returned in step responses and my-steps

---

## Laminatsiya kg Exception (2026-03-06)

Laminatsiya step is now **exempt** from the `kg_produced + kg_waste + kg_ostatok <= kg_received` validation. Laminatsiya adds layers, so output kg can exceed input kg.

---

## kg Validation in Send Flow (2026-03-06)

Added validation when completing a step with send:

- `kg_produced + kg_waste + kg_ostatok <= kg_received` (except laminatsiya)
- `kg_sent <= kg_produced`

---

## quantity_kg Sync on Edit (2026-03-06)

When editing a plan item's `quantity_kg` via `PUT /plan-items/{id}`, step 1's `kg_received` is now auto-updated to match.

---

## Enriched Responses (2026-03-06)

All list endpoints now return names alongside IDs:

- **Plan items**: `order_number`, `order_title`, `brigada_name`, `machine_name`
- **Steps**: `brigada_name`, `machine_name`
- **Sends**: `from_brigada_name`, `to_brigada_name`, `from_step_type`, `to_step_type`
- **My steps**: `order_number`, `order_title`

---

## Phone Login (2026-03-05)

New endpoint for testing: `POST /auth/phone-login`

```json
{"phone": "+998990330919"}
```

Works for both Account and Staff. See [new-auth.md](./new-auth.md) for full docs including roles.

---

## Versioning Fix (2026-03-05)

Fixed bug where editing a plan item or order (versioned update) would orphan child records. Now all child records (steps, sends, logs, material usages, ombor items/transactions) are migrated to the new ID.

**Important for frontend:** After `PUT /plan-items/{id}` or `PUT /orders/{id}`, use the **`id` from the response** — the old ID is soft-deleted.

---

## Negative Stock Fix (2026-03-05)

Cleaned up orphaned ombor transactions from deleted test data that caused negative machine stock values.
