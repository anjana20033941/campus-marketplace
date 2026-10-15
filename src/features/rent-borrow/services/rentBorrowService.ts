import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Listing } from "../../../types";
import { RentBorrowRequest, RentBorrowType } from "../types";

// In-memory mock storage for demo / offline mode
let localRequests: RentBorrowRequest[] = [];

/**
 * Send a new Rent or Borrow request to the seller
 */
export async function sendRentBorrowRequest(params: {
  listing: Listing;
  requesterId: string;
  requesterName: string;
  requesterEmail?: string;
  type: RentBorrowType;
  duration: string;
  offeredPrice?: number;
  message: string;
}): Promise<RentBorrowRequest> {
  const { listing, requesterId, requesterName, requesterEmail, type, duration, offeredPrice, message } = params;

  const newRequest: Omit<RentBorrowRequest, "id"> = {
    listingId: listing.id,
    listingTitle: listing.title,
    listingImage: listing.image,
    requesterId,
    requesterName,
    requesterEmail: requesterEmail || "",
    sellerId: listing.sellerId || "demo-seller",
    sellerName: listing.seller,
    type,
    status: "pending",
    duration,
    offeredPrice: offeredPrice || 0,
    message,
    createdAt: Date.now(),
  };

  if (db) {
    const docRef = await addDoc(collection(db, "rentRequests"), {
      ...newRequest,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...newRequest };
  } else {
    // Offline / Demo fallback
    const mockRequest: RentBorrowRequest = {
      id: "req_" + Date.now(),
      ...newRequest,
    };
    localRequests.unshift(mockRequest);
    return mockRequest;
  }
}

/**
 * Seller accepts the Rent/Borrow request.
 * Crucial step: Updates the request status to 'accepted' AND
 * updates the listing to `isAvailable: false` (or removes it from active exploration list).
 */
export async function acceptRentBorrowRequest(params: {
  requestId: string;
  listingId: string;
  onListingUpdated?: (listingId: string) => void;
}): Promise<void> {
  const { requestId, listingId, onListingUpdated } = params;

  if (db) {
    // 1. Mark request as accepted
    const reqRef = doc(db, "rentRequests", requestId);
    await updateDoc(reqRef, {
      status: "accepted",
      updatedAt: serverTimestamp(),
    });

    // 2. Hide / update listing status so it is removed from active list
    const listingRef = doc(db, "listings", listingId);
    await updateDoc(listingRef, {
      isAvailable: false,
      rentalStatus: "rented",
      updatedAt: serverTimestamp(),
    });
  } else {
    // Offline demo
    const req = localRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = "accepted";
      req.updatedAt = Date.now();
    }
  }

  if (onListingUpdated) {
    onListingUpdated(listingId);
  }
}

/**
 * Seller rejects the Rent/Borrow request.
 */
export async function rejectRentBorrowRequest(requestId: string): Promise<void> {
  if (db) {
    const reqRef = doc(db, "rentRequests", requestId);
    await updateDoc(reqRef, {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });
  } else {
    const req = localRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = "rejected";
      req.updatedAt = Date.now();
    }
  }
}

/**
 * Subscribe to incoming requests for a seller
 */
export function subscribeToIncomingRentRequests(
  sellerId: string,
  callback: (requests: RentBorrowRequest[]) => void
): () => void {
  if (!db) {
    const sellerReqs = localRequests.filter((r) => r.sellerId === sellerId);
    callback(sellerReqs);
    return () => undefined;
  }

  const q = query(collection(db, "rentRequests"), where("sellerId", "==", sellerId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as RentBorrowRequest)
      );
      callback(items);
    },
    () => callback([])
  );
}

/**
 * Subscribe to outgoing requests sent by a student
 */
export function subscribeToMyRentRequests(
  requesterId: string,
  callback: (requests: RentBorrowRequest[]) => void
): () => void {
  if (!db) {
    const myReqs = localRequests.filter((r) => r.requesterId === requesterId);
    callback(myReqs);
    return () => undefined;
  }

  const q = query(collection(db, "rentRequests"), where("requesterId", "==", requesterId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as RentBorrowRequest)
      );
      callback(items);
    },
    () => callback([])
  );
}
