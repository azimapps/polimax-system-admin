
# Implementation Plan - Staff and Stanok Modules

This document summarizes the implementation of the Staff and Stanok (Machines) modules in the Polimax System Admin.

## 1. Staff Module

### Features
- **List View**: Display staff members with search, filter (implied), and action buttons.
- **Create/Edit**: Modal form to add or update staff details.
- **History View**: Track changes to staff records with revert functionality.
- **Archived View**: View and restore deleted staff members.
- **Dynamic Fields**: Form adapts based on staff type (Worker vs Accountant) and salary configuration.

### Files Created
- **Types**: `src/types/staff.ts`
- **API**: `src/api/staff-api.ts`
- **Hooks**: `src/hooks/use-staff.ts`
- **Components**:
    - `src/sections/staff/staff-table.tsx`
    - `src/sections/staff/staff-form.tsx`
    - `src/sections/staff/staff-dialog.tsx`
    - `src/sections/staff/staff-history-dialog.tsx`
    - `src/sections/staff/staff-schema.ts`
- **Views**:
    - `src/sections/staff/view/staff-list-view.tsx`
    - `src/sections/staff/view/staff-archived-view.tsx`
- **Pages**:
    - `src/pages/staff/list.tsx`
    - `src/pages/staff/archived.tsx`
- **Translations**: `src/locales/langs/uz/staff.json`

## 2. Stanok (Machines) Module

### Features
- **List View**: Display machines with search and action buttons.
- **Create/Edit**: Modal form to add or update machine details.
- **History View**: Track changes to machine records with revert functionality.
- **Archived View**: View and restore deleted machines.

### Files Created
- **Types**: `src/types/stanok.ts`
- **API**: `src/api/stanok-api.ts`
- **Hooks**: `src/hooks/use-stanok.ts`
- **Components**:
    - `src/sections/stanok/stanok-table.tsx`
    - `src/sections/stanok/stanok-form.tsx`
    - `src/sections/stanok/stanok-dialog.tsx`
    - `src/sections/stanok/stanok-history-dialog.tsx`
    - `src/sections/stanok/stanok-schema.ts`
- **Views**:
    - `src/sections/stanok/view/stanok-list-view.tsx`
    - `src/sections/stanok/view/stanok-archived-view.tsx`
- **Pages**:
    - `src/pages/stanok/list.tsx`
    - `src/pages/stanok/archived.tsx`
- **Translations**: `src/locales/langs/uz/stanok.json`

## 3. Configuration Updates

- **Routes**: Updated `src/routes/sections/index.tsx` and `src/routes/paths.ts` to include new routes.
- **Navigation**: Updated `src/layouts/nav-config-dashboard.tsx` to add "Staff" and "Stanoklar" to the sidebar.
