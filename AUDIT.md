# AUDIT

## Builds
- backend: PASS (tsc)
- frontend: PASS (next build)

## Requirements

| Requirement | Status | Evidence | Fix |
|---|---|---|---|
| Browse/search listings | PARTIAL | backend/src/controllers/listingController.ts getListings supports q/city/price; frontend listings/page.tsx has q/city only | Add room type filter and price UI |
| Listing details | PARTIAL | frontend listings/[id]/page.tsx basic; no gallery/map/reviews UI | Implement gallery/map/reviews |
| Map view | PARTIAL | frontend/components/Map.tsx exists; listings page toggle added but conditional render incomplete | Fix map/list toggle |
| Reviews visible | MISSING | no feedback UI in frontend | Add feedback UI |
| Register/login | WORKING | authController.ts; frontend login/register | - |
| Booking request | WORKING | bookingController.ts createBooking; frontend detail booking | - |
| Prevent double booking | WORKING | bookingController.ts createBooking checks isAvailable + pending duplicate | - |
| Tenant views bookings/payments | PARTIAL | dashboard page fetches bookings/payments; tenants not shown | Add tenant section |
| Leave feedback | MISSING | no frontend form | Add form |
| Admin listings CRUD | PARTIAL | backend listingController create; no update/delete endpoints | Add PUT/DELETE listing |
| Admin rooms CRUD | WORKING | roomController.ts | - |
| Booking approve/reject atomic | WORKING | bookingController updateBookingStatus uses $transaction + updateMany count | - |
| Tenants view/edit/move-out | MISSING | no tenant management UI; no move-out endpoint | Add |
| Payments record/history | PARTIAL | backend paymentController; frontend dashboard read-only | Add admin payment form |
| Feedback moderation | PARTIAL | backend deleteFeedback exists; no admin UI | Add admin feedback page |
| Dashboard stats | PARTIAL | frontend dashboard computes from bookings/payments | - |

## Cross-cutting
- Authorization: admin routes use authorizeAdmin in routes/*.ts; ownership checks in roomController. Missing listing update/delete.
- Validation: zod in controllers. Payments amount positive.
- Security: JWT from env; rate limit on auth; central error handler P2025 etc.
- Data integrity: onDelete Cascade on rooms/listings; Feedback unique constraint.
- UX states: loading/empty/error present in some pages; cold-start message not implemented.
- Deployment: .env.example present; Render build command needs --include=dev (documented in deploy steps).

## Top problems
1. Critical: listings map toggle incomplete (frontend/src/app/listings/page.tsx)
2. High: no feedback UI (frontend)
3. High: no admin listing edit/delete endpoints (backend)
4. Medium: no tenant management UI
5. Medium: no payments recording UI
6. Medium: no cold-start message
7. Low: image gallery missing
8. Low: map default center not Naval (Map.tsx center [11.5,124.4])
9. Low: no feedback admin page
10. Low: search filters incomplete

## Missing features
- Map UI fully integrated
- Feedback UI
- Admin listing edit/delete
- Tenant management
- Payment recording UI
- Cold-start message

## Next actions
1. Fix map/list toggle.
2. Add feedback UI on detail page.
3. Add admin listing edit/delete endpoints + UI.
4. Add admin payment form.
5. Add tenant move-out flow.