export type VerifiedConditionLevel =
  | "As Claimed (ප්‍රකාශ කළ පරිදිමයි)"
  | "Better than Expected (හොඳ තත්ත්වයේ)"
  | "Slightly Worn (සුළු වශයෙන් භාවිත කළ)"
  | "Heavily Worn (වැඩිපුර භාවිත කළ)";

export interface ConditionRating {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1 to 5 stars
  verifiedCondition: VerifiedConditionLevel;
  comment: string;
  createdAt: number;
}

export interface ListingRatingSummary {
  averageRating: number;
  totalReviews: number;
  accuracyRate: string; // e.g. "98% Condition Accuracy"
}
