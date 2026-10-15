# Rent & Borrow Feature Module (`src/features/rent-borrow`)

This module implements the **Rent & Borrow (කුලියට / ණයට දීම)** capability for the Campus Marketplace application.

## Feature Overview

1. **Borrow / Rent Request**:
   - Buyers can request to rent or borrow items directly from the item detail view.
   - Users can choose either **Borrow (ණයට)** or **Rent (කුලියට)**, specify the requested duration (e.g. 3 days, 1 week), and write a message.
   - For Rent requests, users can optionally offer a rental price.

2. **Seller Acceptance & Automatic Listing Removal**:
   - Sellers receive incoming rent/borrow requests in their requests dashboard.
   - When the seller accepts a request (**Accept & Rent Out**), the request status changes to `accepted`.
   - The corresponding listing is automatically updated to `isAvailable: false` (or `rentalStatus: "rented"`), removing it from the active public Explore feed.

## File Structure

- `types.ts`: Contains TypeScript types (`RentBorrowRequest`, `RentBorrowType`, `RentBorrowStatus`).
- `services/rentBorrowService.ts`: Firebase Firestore integration with offline/demo memory fallback.
- `components/RentBorrowModal.tsx`: Buyer-facing modal to configure and send borrow/rent requests.
- `components/RentRequestsModal.tsx`: Seller-facing inbox to review, accept, or decline incoming requests.
- `index.ts`: Barrel export.
