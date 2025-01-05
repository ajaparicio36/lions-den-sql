type FirebaseErrorCode =
  | "auth/email-not-verified"
  | "auth/claims-too-large"
  | "auth/email-already-exists"
  | "auth/email-already-in-use"
  | "auth/id-token-expired"
  | "auth/id-token-revoked"
  | "auth/insufficient-permission"
  | "auth/internal-error"
  | "auth/invalid-argument"
  | "auth/invalid-claims"
  | "auth/invalid-continue-uri"
  | "auth/invalid-creation-time"
  | "auth/invalid-credential"
  | "auth/invalid-disabled-field"
  | "auth/invalid-display-name"
  | "auth/invalid-dynamic-link-domain"
  | "auth/invalid-email"
  | "auth/invalid-email-verified"
  | "auth/invalid-hash-algorithm"
  | "auth/invalid-hash-block-size"
  | "auth/invalid-hash-derived-key-length"
  | "auth/invalid-hash-key"
  | "auth/invalid-hash-memory-cost"
  | "auth/invalid-hash-parallelization"
  | "auth/invalid-hash-rounds"
  | "auth/invalid-hash-salt-separator"
  | "auth/invalid-id-token"
  | "auth/invalid-last-sign-in-time"
  | "auth/invalid-page-token"
  | "auth/invalid-password"
  | "auth/invalid-password-hash"
  | "auth/invalid-password-salt"
  | "auth/invalid-phone-number"
  | "auth/invalid-photo-url"
  | "auth/invalid-provider-data"
  | "auth/invalid-provider-id"
  | "auth/invalid-session-cookie-duration"
  | "auth/invalid-uid"
  | "auth/invalid-user-import"
  | "auth/maximum-user-count-exceeded"
  | "auth/missing-android-pkg-name"
  | "auth/missing-continue-uri"
  | "auth/missing-hash-algorithm"
  | "auth/missing-ios-bundle-id"
  | "auth/missing-uid"
  | "auth/operation-not-allowed"
  | "auth/phone-number-already-exists"
  | "auth/project-not-found"
  | "auth/reserved-claims"
  | "auth/session-cookie-expired"
  | "auth/session-cookie-revoked"
  | "auth/too-many-requests"
  | "auth/uid-already-exists"
  | "auth/unauthorized-continue-uri"
  | "auth/user-not-found"
  | "auth/wrong-password";

interface FirebaseError extends Error {
  code: FirebaseErrorCode;
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "An unknown error occurred";
  }

  const firebaseError = error as FirebaseError;

  switch (firebaseError.code) {
    // Sign up errors
    case "auth/email-already-in-use":
    case "auth/email-already-exists":
      return "An account with this email already exists";

    // Sign in errors
    case "auth/email-not-verified":
      return "Email is not verified";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-credential":
      return "Invalid login credentials";
    case "auth/invalid-email":
      return "Please enter a valid email address";
    case "auth/invalid-password":
      return "Password must be at least 6 characters";

    // Token/Session errors
    case "auth/id-token-expired":
    case "auth/session-cookie-expired":
      return "Your session has expired. Please sign in again";
    case "auth/id-token-revoked":
    case "auth/session-cookie-revoked":
      return "Your session has been revoked. Please sign in again";

    // Rate limiting
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";

    // Permission errors
    case "auth/insufficient-permission":
      return "You do not have permission to perform this action";
    case "auth/operation-not-allowed":
      return "This operation is not allowed";

    // Project configuration
    case "auth/project-not-found":
      return "Project configuration error. Please contact support";

    // Generic errors
    case "auth/internal-error":
      return "An internal error occurred. Please try again";

    default:
      return "An authentication error occurred. Please try again";
  }
}

// Usage example with error boundary or try-catch
export function handleFirebaseError(error: unknown) {
  const errorMessage = getFirebaseErrorMessage(error);
  // You can now display this message to the user
  return {
    error: true,
    message: errorMessage,
  };
}
