# Salary System

## Overview

The salary system calculates, confirms, and pays monthly salaries for all Polimax staff.
Access is restricted to **accountants** only (`AccountRole.accountant`).

---

## Staff Types & Salary Fields

### Office Staff (`crm`, `accountant`, `planner`)

| Field          | Description        |
|----------------|--------------------|
| `fixed_salary` | Monthly fixed pay  |

**Formula:** `total = fixed_salary`

No KPI component. Salary is the same every month.

### Workers (`pechat`, `reska`, `laminatsiya`)

| Field                              | Description                               |
|------------------------------------|-------------------------------------------|
| `worker_fixed_salary`              | Monthly base pay                          |
| `kpi_salary`                       | Default KPI rate (UZS per meter)          |
| `kpi_tayyor_mahsulotlar_reskasi`   | Rate for finished-product cutting         |
| `kpi_tayyor_mahsulot_peremotkasi`  | Rate for finished-product rewinding       |
| `kpi_plyonka_peremotkasi`          | Rate for film rewinding                   |
| `kpi_3_5_sm_reska`                 | Rate for 3.5 cm cutting                   |
| `kpi_asobiy_tarif`                 | Special/personal tariff rate              |

**Formula:** `total = worker_fixed_salary + SUM(meters_produced x kpi_rate)`

---

## KPI Calculation

Each production log entry records:
- `worker_id` - who did the work
- `meters_produced` - how many meters were produced
- `work_type` - what kind of work was done (optional)

The system maps each `work_type` to the corresponding KPI rate field on the staff record:

| Work Type                       | Staff KPI Field                        |
|---------------------------------|----------------------------------------|
| `tayyor_mahsulotlar_reskasi`    | `kpi_tayyor_mahsulotlar_reskasi`       |
| `tayyor_mahsulot_peremotkasi`   | `kpi_tayyor_mahsulot_peremotkasi`      |
| `plyonka_peremotkasi`           | `kpi_plyonka_peremotkasi`              |
| `reska_3_5_sm`                  | `kpi_3_5_sm_reska`                     |
| `asobiy_tarif`                  | `kpi_asobiy_tarif`                     |
| `null` (no work type)           | `kpi_salary` (default rate)            |

**Example:**

Worker Aziz has:
- `worker_fixed_salary`: 3,000,000 UZS
- `kpi_tayyor_mahsulotlar_reskasi`: 500 UZS/meter
- `kpi_plyonka_peremotkasi`: 400 UZS/meter

In March, he produced:
- 1,200 meters of `tayyor_mahsulotlar_reskasi`
- 800 meters of `plyonka_peremotkasi`

```
KPI  = (1200 x 500) + (800 x 400) = 600,000 + 320,000 = 920,000
Total = 3,000,000 + 920,000 = 3,920,000 UZS
```

---

## Workflow

```
Preview  ──>  Confirm  ──>  Pay
```

1. **Preview** - Accountant views calculated salaries (read-only, not saved)
2. **Confirm** - Accountant locks in the salary amounts (creates `SalaryRecord` rows)
3. **Pay** - Accountant marks as paid (creates a `Finance` expense record automatically)

---

## API Endpoints

All endpoints require `AccountRole.accountant`.

### `GET /salary/preview`

Calculate salaries without saving. Use this to review before confirming.

**Query params:**
| Param      | Type  | Required | Description                    |
|------------|-------|----------|--------------------------------|
| `year`     | int   | yes      | Year (e.g. 2026)               |
| `month`    | int   | yes      | Month (1-12)                   |
| `staff_id` | int   | no       | Filter to a single staff member|

**Response:** `SalaryPreviewResponse`

```json
{
  "year": 2026,
  "month": 3,
  "grand_total": 45000000.0,
  "items": [
    {
      "staff_id": 5,
      "fullname": "Aziz Karimov",
      "staff_type": "worker",
      "worker_type": "reska",
      "fixed_amount": 3000000.0,
      "kpi_amount": 920000.0,
      "total_amount": 3920000.0,
      "kpi_breakdown": [
        {
          "work_type": "tayyor_mahsulotlar_reskasi",
          "meters": 1200.0,
          "rate": 500.0,
          "subtotal": 600000.0
        },
        {
          "work_type": "plyonka_peremotkasi",
          "meters": 800.0,
          "rate": 400.0,
          "subtotal": 320000.0
        }
      ]
    }
  ]
}
```

### `POST /salary/confirm`

Lock in salary amounts for a month. Creates `SalaryRecord` rows with status `confirmed`.

**Body:**

```json
{
  "year": 2026,
  "month": 3,
  "staff_ids": [1, 2, 5]   // optional — omit to confirm all staff
}
```

- Fails if records already exist for that staff/month (unique constraint).
- Returns the created `SalaryRecord` list.

### `GET /salary`

List confirmed/paid salary records with filtering.

**Query params:**
| Param        | Type         | Required | Description             |
|--------------|--------------|----------|-------------------------|
| `year`       | int          | no       | Filter by year          |
| `month`      | int          | no       | Filter by month (1-12)  |
| `status`     | SalaryStatus | no       | `confirmed` or `paid`   |
| `staff_type` | StaffType    | no       | `worker`, `crm`, etc.   |
| `limit`      | int          | no       | Default 100, max 500    |
| `offset`     | int          | no       | Pagination offset       |

### `GET /salary/staff/{staff_id}`

Get one person's full salary history with detailed KPI breakdown per month.

**Query params:**
| Param             | Type | Required | Description                                      |
|-------------------|------|----------|--------------------------------------------------|
| `year`            | int  | no       | Filter to a specific year                        |
| `include_preview` | bool | no       | Include live calculation for current unconfirmed month (default `false`) |

**Response:** `StaffSalaryDetailResponse`

```json
{
  "staff_id": 5,
  "fullname": "Aziz Karimov",
  "staff_type": "worker",
  "worker_type": "reska",
  "fixed_salary": 3000000.0,
  "kpi_rates": {
    "kpi_salary": 300,
    "kpi_tayyor_mahsulotlar_reskasi": 500,
    "kpi_tayyor_mahsulot_peremotkasi": null,
    "kpi_plyonka_peremotkasi": 400,
    "kpi_3_5_sm_reska": null,
    "kpi_asobiy_tarif": null
  },
  "records": [
    {
      "id": 10,
      "year": 2026,
      "month": 2,
      "fixed_amount": 3000000.0,
      "kpi_amount": 850000.0,
      "total_amount": 3850000.0,
      "status": "paid",
      "confirmed_at": "2026-03-01T10:00:00",
      "paid_at": "2026-03-05T14:30:00",
      "kpi_breakdown": [
        {
          "work_type": "tayyor_mahsulotlar_reskasi",
          "meters": 1700.0,
          "rate": 500.0,
          "subtotal": 850000.0
        }
      ]
    },
    {
      "id": 8,
      "year": 2026,
      "month": 1,
      "fixed_amount": 3000000.0,
      "kpi_amount": 600000.0,
      "total_amount": 3600000.0,
      "status": "paid",
      "confirmed_at": "2026-02-01T09:00:00",
      "paid_at": "2026-02-03T11:00:00",
      "kpi_breakdown": [
        {
          "work_type": "tayyor_mahsulotlar_reskasi",
          "meters": 1200.0,
          "rate": 500.0,
          "subtotal": 600000.0
        }
      ]
    }
  ],
  "summary": {
    "total_fixed": 6000000.0,
    "total_kpi": 1450000.0,
    "total_earned": 7450000.0,
    "total_paid": 7450000.0,
    "total_unpaid": 0.0,
    "months_count": 2
  }
}
```

**Notes:**
- Records are ordered newest month first.
- When `include_preview=true`, a live-calculated record for the current month appears first with `id=0` (not yet confirmed).
- `kpi_rates` is `null` for office staff (they have no KPI).

### `GET /salary/{id}`

Get a single salary record by ID.

### `POST /salary/pay`

Mark salary records as paid. Automatically creates a `Finance` expense entry for each.

**Body:**

```json
{
  "salary_record_ids": [10, 11, 12],
  "payment_method": "cash",
  "notes": "March 2026 salaries"
}
```

- Only `confirmed` records can be paid (already-paid records are rejected).
- Creates `Finance` records with:
  - `finance_type`: `chiqim` (expense)
  - `expense_category`: `maosh` (salary)
  - `expense_frequency`: `recurring`
  - `currency`: `uzs`
  - `expense_title`: `"Oylik: {fullname} ({year}/{month})"`

---

## Data Model

### `SalaryRecord` (`salary_records` table)

| Column              | Type         | Description                                  |
|---------------------|--------------|----------------------------------------------|
| `id`                | int          | Primary key                                  |
| `staff_id`          | int (FK)     | Reference to `staff.id`                      |
| `year`              | int          | Salary year                                  |
| `month`             | int          | Salary month (1-12)                          |
| `staff_type`        | StaffType    | Snapshot of staff type at confirmation        |
| `worker_type`       | WorkerType   | Snapshot of worker type (nullable for office) |
| `fixed_amount`      | float        | Fixed salary component                       |
| `kpi_amount`        | float        | KPI salary component                         |
| `total_amount`      | float        | `fixed_amount + kpi_amount`                  |
| `status`            | SalaryStatus | `confirmed` or `paid`                        |
| `confirmed_by`      | int (FK)     | Account that confirmed                       |
| `confirmed_at`      | datetime     | When confirmed                               |
| `paid_by`           | int (FK)     | Account that marked as paid                  |
| `paid_at`           | datetime     | When paid                                    |
| `finance_record_id` | int (FK)     | Link to auto-created Finance expense          |

**Unique constraint:** One record per `(staff_id, year, month)`.

---

## Key Files

| File                                | Purpose                        |
|-------------------------------------|--------------------------------|
| `app/domains/salary/routes.py`      | API endpoints + calculation    |
| `app/domains/salary/models.py`      | `SalaryRecord` model           |
| `app/domains/salary/schemas.py`     | Request/response schemas       |
| `app/models/staff.py`              | Staff model with KPI fields    |
| `app/domains/material_usage/models.py` | `ProductionLog` + `WorkType` |
