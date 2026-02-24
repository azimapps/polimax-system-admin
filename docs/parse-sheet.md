# Sheet Parsing API (Simplified)

Excel faylni yuklash → AI ustunlarni moslash → toza natija olish. Bir qadam.

## Umumiy oqim

```
1. POST /ombor/{type}/parse-sheet              → fayl yuklash → darhol natija (status=complete)
2. POST /ombor/{type}/parse-sheet/{id}/import  → bulk import → barcha itemlar yaratiladi
3. GET  /ombor/{type}/parse-sheet/{id}/download → toza .xlsx yuklab olish (public, auth shart emas)
```

> Upload har doim `status=complete` qaytaradi. Savollar yo'q.
> Topilmagan maydonlar `null` bo'ladi (xato emas).

---

## Endpointlar

### 1. Fayl yuklash

```
POST /ombor/{type}/parse-sheet
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Param | Type | Tavsif |
|-------|------|--------|
| `file` | file | `.xls` yoki `.xlsx` fayl |

#### Javob: `SheetUploadResponse`

```json
{
  "session_id": 1,
  "status": "complete",
  "total_rows": 50,
  "headers": ["Название", "Дата", "Вес (кг)"],
  "questions": [],
  "result": {
    "total_rows": 50,
    "valid_rows": 48,
    "items": [...],
    "errors": [...]
  }
}
```

| Field | Type | Tavsif |
|-------|------|--------|
| `session_id` | int | Sessiya ID — download uchun ishlatiladi |
| `status` | string | Har doim `"complete"` |
| `total_rows` | int | Jami qatorlar soni |
| `headers` | string[] | Fayldan aniqlangan ustun nomlari |
| `questions` | Question[] | Har doim bo'sh `[]` |
| `result` | SheetParseResult | Parse natijasi |

#### Ichki oqim:

**a) Bo'sh fayl:**
Fayl bo'sh yoki headerlar yo'q → darhol `status=complete` (0 qator)

**b) Aniq headerlar (tez yo'l):**
Ustunlar to'g'ridan-to'g'ri mos kelsa → AI chaqirilmaydi → darhol `status=complete`

**c) AI moslash:**
AI (Gemini) headerlarni database maydonlariga moslaydi → darhol `status=complete`

#### Messy fayllar qo'llab-quvvatlanadi:

- Title qatorlar (masalan "ИНФОРМАЦИЯ") avtomatik o'tkaziladi
- Sub-header qatorlar (masalan "бочка", "кг") asosiy header bilan birlashtiriladi
- Jami/итого qatorlar filtrlanadi
- Topilmagan maydonlar `null` bo'ladi

---

### 2. Bulk import

```
POST /ombor/{type}/parse-sheet/{session_id}/import
Authorization: Bearer <token>
```

> Parse natijasidagi barcha itemlarni tizimga import qiladi.

Faqat `status=complete` bo'lgan sessiyalar uchun ishlaydi.

#### Javob: `SheetImportResponse`

```json
{
  "session_id": 5,
  "status": "imported",
  "imported_count": 61,
  "item_ids": [101, 102, 103]
}
```

| Field | Type | Tavsif |
|-------|------|--------|
| `session_id` | int | Sessiya ID |
| `status` | string | `"imported"` |
| `imported_count` | int | Yaratilgan itemlar soni |
| `item_ids` | int[] | Yaratilgan item IDlar |

---

### 4. Natijani yuklab olish

```
GET /ombor/{type}/parse-sheet/{session_id}/download
```

> **Public endpoint** — auth talab qilinmaydi.

Faqat `status=complete` bo'lgan sessiyalar uchun ishlaydi.

**Javob:** `.xlsx` fayl (`Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

Fayl nomi: `parsed_{original_filename}.xlsx`

---

### 5. Savollarga javob (backward compatibility)

```
POST /ombor/{type}/parse-sheet/{session_id}/answer
Content-Type: application/json
Authorization: Bearer <token>
```

> Bu endpoint mavjud, lekin yangi oqimda ishlatilmaydi (upload har doim complete qaytaradi).

---

## Schemalar

### `SheetParseResult`

```json
{
  "total_rows": 120,
  "valid_rows": 118,
  "items": [
    {
      "name": "Qizil kraska Siegwerk",
      "date": "2025-03-01T00:00:00",
      "total_kg": 200.0,
      "barrels": 4,
      "price_per_kg": 8.0,
      "marka": "Siegwerk",
      "color_name": "Qizil"
    }
  ],
  "errors": [
    {"row": 99, "message": "Invalid value for total_kg: could not convert string to float: 'N/A'"}
  ]
}
```

| Field | Type | Tavsif |
|-------|------|--------|
| `total_rows` | int | Jami qatorlar |
| `valid_rows` | int | Muvaffaqiyatli qatorlar |
| `items` | dict[] | Validatsiyadan o'tgan ma'lumotlar |
| `errors` | SheetRowError[] | Faqat tip casting xatolari (missing field emas) |

### `SheetRowError`

```json
{"row": 45, "message": "Invalid value for total_kg: could not convert string to float: 'N/A'"}
```

---

## Xatolar

| Status | Tavsif |
|--------|--------|
| `422` | Fayl yuklanmagan |
| `422` | Fayl formati noto'g'ri (`.xls` yoki `.xlsx` kerak) |
| `422` | Faylni o'qib bo'lmadi |
| `422` | AI mapping xatosi (headerlar mos kelmaydi va AI ham ishlamadi) |
| `404` | Sessiya topilmadi |
| `400` | Yuklab olish uchun natija yo'q |

---

## Header tarjimalari (UZ / RU)

AI quyidagi o'zbekcha va ruscha headerlarni avtomatik taniydi:

| Maydon | O'zbekcha (UZ) | Ruscha (RU) |
|--------|---------------|-------------|
| name | Nomi | Название |
| date | Sana | Дата |
| description | Izoh | Описание |
| price_currency | Valyuta | Валюта |
| supplier_id | Yetkazuvchi ID | Поставщик ID |
| total_kg | Jami kg | Вес (кг) |
| total_liter | Jami litr | Объём (литр) |
| price_per_kg | 1 kg narxi | Цена за кг |
| price_per_liter | 1 litr narxi | Цена за литр |
| price | Narxi | Цена |
| quantity | Soni | Количество |
| barrels | Bochkalar | Бочки (шт) |
| seriya_number | Seriya raqami | Серийный номер |
| number_identifier | Raqam | Номер |
| color_name | Rang | Цвет |
| color_hex | HEX rang | HEX цвет |
| marka | Marka | Марка |
| solvent_type | Erituvchi turi | Тип растворителя |
| origin | Mamlakat | Страна |
| product_type | Mahsulot turi | Тип продукта |

## Enum qiymatlari

| Maydon | Qiymatlar |
|--------|-----------|
| `price_currency` | `uzs`, `usd`, `rub`, `eur` |
| `plyonka_category` | `bopp`, `cpp`, `pe`, `pet` |
| `solvent_type` | `eaf`, `ea`, `metoksil` |
| `origin` | `china`, `germany` |

---

## Misol: Haqiqiy kraska fayli

```bash
curl -X POST /ombor/kraska/parse-sheet \
  -H "Authorization: Bearer <token>" \
  -F "file=@Остатки по краскам на 01.03.25г.xls"
```

```json
{
  "session_id": 1,
  "status": "complete",
  "total_rows": 45,
  "headers": ["Наименование красок", "Дата прихода", "Серия", "Марка", "Общее количество бочка", "Общее количество кг", "Цена за кг"],
  "result": {
    "total_rows": 45,
    "valid_rows": 42,
    "items": [
      {
        "name": "Process Black C",
        "date": "2025-03-01T00:00:00",
        "seriya_number": "SN-001",
        "marka": "Siegwerk",
        "barrels": 4,
        "total_kg": 200.0,
        "price_per_kg": 8.0
      }
    ],
    "errors": []
  }
}
```

### Yuklab olish

```bash
curl -O /ombor/kraska/parse-sheet/1/download
# → parsed_Остатки по краскам на 01.03.25г.xlsx
```

---

## Qisqacha jadval

| Sheet sifati | Qadamlar | Oqim |
|---|---|---|
| Inglizcha aniq headerlar | 1 | yuklash → **tayyor** |
| Har qanday headerlar (AI moslaydi) | 1 | yuklash → AI → **tayyor** |
| Bo'sh fayl | 1 | yuklash → **tayyor** (0 qator) |
| Tayyor sessiya | +1 | `GET .../download` → **.xlsx** |

---

## Namuna fayllar

| Fayl | Tavsif |
|------|--------|
| [Остатки по краскам на 01.03.25г.xls](../../examples/Остатки%20по%20краскам%20на%2001.03.25г.xls) | Haqiqiy kraska qoldiqlari (messy format) |

> Batafsil: [examples/README.md](../../examples/README.md)
