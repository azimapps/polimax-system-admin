# Phone Login (Testing)

## `POST /auth/phone-login`

Login by phone number only — no password needed. For testing/development.

Works for **both**:
- **Account** (accountant, ceo) — matches `Account.login`
- **Staff** (worker, CRM, brigada leader) — matches `Staff.phone_number`, auto-creates account if needed

**Request**

```json
{
  "phone": "990330919"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | yes | Телефон рақами |

**Response `200`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "account": {
    "id": 2,
    "version": 1,
    "login": "990330919",
    "role": "pechat",
    "fullname": "Солихбек",
    "avatar_url": null,
    "staff_id": 179,
    "session_token": "...",
    "last_login_at": "2026-03-05T18:00:00",
    "created_at": "...",
    "updated_at": "...",
    "deleted_at": null,
    "archived_at": null,
    "created_by": null,
    "archived_by": null,
    "previous_id": null
  }
}
```

**Errors**

| Code | Description |
|------|-------------|
| `404` | "Account or staff not found for this phone number" |

## How it works

1. Tries `Account.login == phone` first
2. If not found → tries `Staff.phone_number == phone`
3. If staff found but no account → auto-creates account linked to that staff
4. Returns JWT token

## Usage

```
POST /auth/phone-login
Content-Type: application/json

{"phone": "990330919"}
```

Token → `Authorization: Bearer <token>` for all other requests.

## Roles

The `account.role` field tells the frontend **where to redirect** after login.

| Role | Value | Who | Frontend page |
|------|-------|-----|---------------|
| `ceo` | `"ceo"` | Director / boss | Admin dashboard |
| `accountant` | `"accountant"` | Accountant | Admin dashboard (full access) |
| `crm` | `"crm"` | Sales manager | CRM / orders page |
| `orders_planning` | `"orders_planning"` | Planner | Orders planning page |
| `mix_station` | `"mix_station"` | Mix station operator | Mix station page |
| `pechat` | `"pechat"` | Print brigada leader | Production (pechat) |
| `laminatsiya` | `"laminatsiya"` | Lamination brigada leader | Production (laminatsiya) |
| `reska` | `"reska"` | Cutting brigada leader | Production (reska) |
| `stanok` | `"stanok"` | Machine operator | Production (stanok) |

### How to use in frontend

```js
const { token, account } = await login(phone);

// Redirect based on role
switch (account.role) {
  case "ceo":
  case "accountant":
    router.push("/admin");
    break;
  case "crm":
    router.push("/crm");
    break;
  case "orders_planning":
    router.push("/planning");
    break;
  case "mix_station":
    router.push("/mix");
    break;
  case "pechat":
  case "laminatsiya":
  case "reska":
  case "stanok":
    router.push("/production");
    break;
}
```

### Role groups

- **Management**: `ceo`, `accountant` — can access everything
- **Operations**: `crm`, `orders_planning`, `mix_station` — specific pages
- **Production**: `pechat`, `laminatsiya`, `reska`, `stanok` — brigada leaders, production log page

---

## vs Other Login Methods

| | `POST /auth/login` | `POST /staff/login` | `POST /auth/phone-login` |
|---|---|---|---|
| Who | Account (ceo, accountant) | Staff (Telegram) | Both |
| Auth | login + password | Telegram widget | Phone number only |
| Use case | Production | Production | Testing |
