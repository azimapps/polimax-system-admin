# Sheet Parsing API (Simplified)

Excel faylni yuklash → AI ustunlarni moslash → natijani ko'rish → import qilish.

## Umumiy oqim

```
1. POST /ombor/{type}/parse-sheet                → fayl yuklash → darhol natija (status=complete)
2. POST /ombor/{type}/parse-sheet/{id}/import     → bazaga saqlash (status=imported)
3. GET  /ombor/{type}/parse-sheet/{id}/download   → toza .xlsx yuklab olish (public)
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
| `session_id` | int | Sessiya ID — import va download uchun ishlatiladi |
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
- **Headersiz fayllar** — header qatori yo'q bo'lsa, parser avtomatik aniqlaydi (quyida batafsil)

---

### 2. Bazaga import qilish

```
POST /ombor/{type}/parse-sheet/{session_id}/import
Authorization: Bearer <token>
```

Frontend foydalanuvchi parse natijasini ko'rib chiqib, "Import" tugmasini bosganida chaqiriladi.
Barcha `result.items` ni `ombor_items` jadvaliga yozadi.

#### Javob: `SheetImportResponse`

```json
{
  "session_id": 5,
  "status": "imported",
  "imported_count": 61,
  "item_ids": [101, 102, 103, 104, 105]
}
```

| Field | Type | Tavsif |
|-------|------|--------|
| `session_id` | int | Sessiya ID |
| `status` | string | Har doim `"imported"` |
| `imported_count` | int | Nechta item yaratildi |
| `item_ids` | int[] | Yaratilgan ombor item ID lari |

#### Xatolar:

| Status | Tavsif |
|--------|--------|
| `404` | Sessiya topilmadi |
| `400` | Sessiya allaqachon import qilingan (`"Session already imported"`) |
| `400` | Sessiya hali tayyor emas (`"Session is not complete yet"`) |
| `400` | Import qilish uchun natija yo'q (`"No valid items to import"`) |

> **Muhim:** Ikki marta import qilib bo'lmaydi — sessiya `imported` statusga o'tadi.

---

### 3. Natijani yuklab olish

```
GET /ombor/{type}/parse-sheet/{session_id}/download
```

> **Public endpoint** — auth talab qilinmaydi.

Faqat `status=complete` yoki `status=imported` bo'lgan sessiyalar uchun ishlaydi.

**Javob:** `.xlsx` fayl (`Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

Fayl nomi: `parsed_{original_filename}.xlsx`

---

### 4. Savollarga javob (backward compatibility)

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

### `SheetImportResponse`

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
| `item_ids` | int[] | Yaratilgan ombor item ID lari |

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

### Import qilish

```bash
curl -X POST /ombor/kraska/parse-sheet/1/import \
  -H "Authorization: Bearer <token>"
```

```json
{
  "session_id": 1,
  "status": "imported",
  "imported_count": 61,
  "item_ids": [101, 102, 103, 104, 105, 106]
}
```

### Yuklab olish

```bash
curl -O /ombor/kraska/parse-sheet/1/download
# → parsed_Остатки по краскам на 01.03.25г.xlsx
```

---

## Headersiz fayllar

Ba'zi fayllar header qatorisiz keladi — masalan, plyonka qoldiqlari fayli.
Parser birinchi ma'lumotli qatorni tekshiradi: agar ko'p kataklar raqam yoki sanaga o'xshasa (matn emas), fayl **headersiz** deb hisoblanadi.

### Parser nima qiladi:

1. **Headersizlikni aniqlash** — birinchi qatorning > 50% kataklari raqam/sana bo'lsa → header emas
2. **Dublikat ustunlarni kesish** — o'rtada bo'sh ustunlar bo'lib, keyin xuddi shu ma'lumot takrorlansa, faqat birinchi guruh qoldiriladi
3. **Pozitsion headerlar generatsiya** — `Column 1`, `Column 2`, ..., `Column N`
4. **AI moslash** — Gemini `Column 1` = `seriya_number`, `Column 2` = `date` kabi xulosa chiqaradi

### Fayl tuzilishi (headersiz plyonka):

| Ustun | Namuna | Maydon |
|-------|--------|--------|
| Column 1 | 4541, 4770 | `seriya_number` |
| Column 2 | "26,05,2023" | `date` |
| Column 3 | "Биаксплен" | *(supplier — plyonka allowed da yo'q, o'tkaziladi)* |
| Column 4 | "БОПП Жем.этикеточная" | `name` |
| Column 5 | "LOBA", "LPS 332" | `plyonka_subcategory` |
| Column 6 | 13, 55 | `thickness` |
| Column 7 | 38, 68 | `width` |
| Column 8 | 1, 2 | *(quantity — plyonka allowed da yo'q, o'tkaziladi)* |
| Column 9 | 1.1, 7, 148.6 | `total_kg` |

### `plyonka_category` name ustunidan olinadi (AI value_mappings orqali):

| Name qiymati | Kategoriya |
|-------------|------------|
| "БОПП ..." | `bopp` |
| "СРР ..." | `cpp` |
| "ПЭ ..." | `pe` |
| "ПЭТ ..." | `pet` |

### `null` bo'ladigan maydonlar:

`price_per_kg`, `price_currency`, `description`, `supplier_id`, `davaldiylik_id` — faylda mavjud emas, xato bermaydi.

### Misol:

```bash
curl -X POST /ombor/plyonka/parse-sheet \
  -H "Authorization: Bearer <token>" \
  -F "file=@Наш склад остатки на 01.02.2026г..xlsx"
```

```json
{
  "session_id": 3,
  "status": "complete",
  "total_rows": 404,
  "headers": ["Column 1", "Column 2", "Column 3", "Column 4", "Column 5", "Column 6", "Column 7", "Column 8", "Column 9"],
  "result": {
    "total_rows": 404,
    "valid_rows": 400,
    "items": [
      {
        "name": "БОПП Жем.этикеточная",
        "date": "2023-05-26T00:00:00",
        "seriya_number": "4541",
        "plyonka_subcategory": "LOBA",
        "thickness": 13.0,
        "width": 38.0,
        "total_kg": 1.1,
        "plyonka_category": "bopp"
      }
    ],
    "errors": []
  }
}
```

---

## Qisqacha jadval

| Sheet sifati | Qadamlar | Oqim |
|---|---|---|
| Inglizcha aniq headerlar | 2 | yuklash → **tayyor** → import → **saqlandi** |
| Har qanday headerlar (AI moslaydi) | 2 | yuklash → AI → **tayyor** → import → **saqlandi** |
| Headersiz fayl (AI moslaydi) | 2 | yuklash → pozitsion headerlar → AI → **tayyor** → import → **saqlandi** |
| Bo'sh fayl | 1 | yuklash → **tayyor** (0 qator) |
| Tayyor sessiya | +1 | `POST .../import` → **saqlandi** |
| Yuklab olish | +1 | `GET .../download` → **.xlsx** |

---

## Namuna fayllar

| Fayl | Tavsif |
|------|--------|
| [Остатки по краскам на 01.03.25г.xls](../../examples/Остатки%20по%20краскам%20на%2001.03.25г.xls) | Haqiqiy kraska qoldiqlari (messy format, headerli) |
| [Наш склад остатки на 01.02.2026г..xlsx](../../examples/Наш%20склад%20остатки%20на%2001.02.2026г..xlsx) | Plyonka qoldiqlari (headersiz, dublikat ustunli) |

> Batafsil: [examples/README.md](../../examples/README.md)
