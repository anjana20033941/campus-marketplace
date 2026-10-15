import { User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { APPROVED_UNIVERSITIES } from "../universities";
import { University, VerificationResult } from "../types";

// In-memory cache for verified users in offline/demo mode
const verifiedUserIds = new Set<string>();
const userUniversityMap = new Map<string, { universityId: string; universityName: string }>();

/**
 * Returns all active universities from the database configuration
 */
export function getActiveUniversities(): University[] {
  return APPROVED_UNIVERSITIES.filter((u) => u.isActive);
}

/**
 * Extracts and verifies the Google OAuth email against the chosen university
 */
export function verifyGoogleAccountUniversity(
  email: string,
  universityId: string
): VerificationResult {
  const university = APPROVED_UNIVERSITIES.find((u) => u.id === universityId);

  if (!university) {
    return {
      success: false,
      userEmail: email,
      errorMessage: "Selected university not found in database.",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      userEmail: email,
      errorMessage: "Invalid Google email address.",
    };
  }

  const emailDomain = email.split("@")[1].toLowerCase().trim();

  // Match domain against approved domains list
  const matchedDomain = university.emailDomains.find((domain) => {
    const cleanDomain = domain.replace(/^@/, "").toLowerCase().trim();
    return emailDomain === cleanDomain || emailDomain.endsWith("." + cleanDomain);
  });

  if (matchedDomain) {
    return {
      success: true,
      university,
      userEmail: email,
      matchedDomain,
    };
  }

  // Domain mismatch error with allowed domain hints
  const allowedList = university.emailDomains
    .map((d) => (d.startsWith("@") ? d : `@${d}`))
    .join(", ");

  return {
    success: false,
    university,
    userEmail: email,
    errorMessage: `This Google account (${email}) does not belong to ${university.name}.\n\nAllowed domains: ${allowedList}`,
  };
}

/**
 * Saves university verification state to Firestore and local session
 */
export async function saveUserUniversityVerification(
  user: User,
  university: University,
  matchedDomain: string
): Promise<void> {
  verifiedUserIds.add(user.uid);
  userUniversityMap.set(user.uid, {
    universityId: university.id,
    universityName: university.name,
  });

  if (db) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        universityVerified: true,
        universityId: university.id,
        universityName: university.name,
        verifiedDomain: matchedDomain,
        verifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

/**
 * Checks if a user has completed university verification
 */
export function isUserUniversityVerified(user: User | null): boolean {
  if (!user) return false;
  return verifiedUserIds.has(user.uid);
}

/**
 * Gets the verified university name for a given user
 */
export function getUserUniversityName(user: User | null): string | undefined {
  if (!user) return undefined;
  return userUniversityMap.get(user.uid)?.universityName;
}
