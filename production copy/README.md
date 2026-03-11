# Production Pipeline System

## Overview

Production pipeline tracks an order through manufacturing steps: reska, pechat, sushka, laminatsiya, tayyor.

## Models

| Model | Purpose |
|-------|---------|
| `PlanItem` | One production job per order, with `plan_type` |
| `PlanItemStep` | Each step in the pipeline (auto-generated) |
| `ProductionSend` | Material sent between steps |
| `MaterialUsage` | Ombor materials consumed per step |
| `ProductionLog` | Per-worker production tracking |

## Plan Types & Pipelines

| `plan_type` | Steps |
|-------------|-------|
| `pechat_first` | pechat → sushka → laminatsiya → sushka → reska → tayyor |
| `full_cycle` | reska → pechat → sushka → laminatsiya → sushka → reska → tayyor |
| `no_final_reska` | reska → pechat → sushka → laminatsiya → sushka → tayyor |

## Docs

1. `1. plan-item.md` — Plan item creation & auto-step generation
2. `2. steps.md` — Step tracking (status, kg, brigada)
3. `3. production-send.md` — Sending material between steps
4. `4. material-usage.md` — Ombor material consumption per step
5. `5. tayyor.md` — Final step, auto-create tayyor_angren ombor item
6. `6. production-log.md` — Per-worker production logs

## Key Rules

- Sushka: no material loss, kg_in = kg_out, just countdown
- Sushka brigada = NEXT step's brigada (not sender's)
- Laminatsiya: kg_produced can be MORE than kg_received (layers added)
- Partial sends allowed (multiple ProductionSend per step)
- TAYYOR always goes to `tayyor_angren` ombor
- Same order sends to tayyor sum up into one OmborItem, full history in transactions
