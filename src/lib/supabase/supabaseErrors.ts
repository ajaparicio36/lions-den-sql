type SupabaseStorageErrorCode =
  | "NoSuchBucket"
  | "NoSuchKey"
  | "NoSuchUpload"
  | "InvalidJWT"
  | "InvalidRequest"
  | "TenantNotFound"
  | "EntityTooLarge"
  | "InternalError"
  | "ResourceAlreadyExists"
  | "InvalidBucketName"
  | "InvalidKey"
  | "InvalidRange"
  | "InvalidMimeType"
  | "InvalidUploadId"
  | "KeyAlreadyExists"
  | "BucketAlreadyExists"
  | "DatabaseTimeout"
  | "InvalidSignature"
  | "SignatureDoesNotMatch"
  | "AccessDenied"
  | "ResourceLocked"
  | "DatabaseError"
  | "MissingContentLength"
  | "MissingParameter"
  | "InvalidUploadSignature"
  | "LockTimeout"
  | "S3Error"
  | "S3InvalidAccessKeyId"
  | "S3MaximumCredentialsLimit"
  | "InvalidChecksum"
  | "MissingPart"
  | "SlowDown";

interface SupabaseStorageError extends Error {
  code: SupabaseStorageErrorCode;
}

export function getSupabaseStorageErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "An unknown storage error occurred.";
  }

  const storageError = error as SupabaseStorageError;

  switch (storageError.code) {
    case "NoSuchBucket":
      return "The specified bucket does not exist.";
    case "NoSuchKey":
      return "The specified key does not exist in the bucket.";
    case "NoSuchUpload":
      return "The specified upload does not exist or was aborted.";
    case "InvalidJWT":
      return "The provided JWT is invalid. Please provide a valid token.";
    case "InvalidRequest":
      return "The request is not properly formed. Review the parameters and try again.";
    case "TenantNotFound":
      return "The specified tenant does not exist.";
    case "EntityTooLarge":
      return "The file being uploaded is too large.";
    case "InternalError":
      return "An internal server error occurred. Please try again later.";
    case "ResourceAlreadyExists":
    case "KeyAlreadyExists":
      return "The specified resource or key already exists.";
    case "InvalidBucketName":
      return "The specified bucket name is invalid.";
    case "InvalidKey":
      return "The specified key is invalid.";
    case "InvalidRange":
      return "The specified range is invalid.";
    case "InvalidMimeType":
      return "The specified MIME type is invalid.";
    case "InvalidUploadId":
      return "The provided upload ID is invalid or missing.";
    case "BucketAlreadyExists":
      return "The specified bucket already exists.";
    case "DatabaseTimeout":
      return "A timeout occurred while accessing the database.";
    case "InvalidSignature":
    case "SignatureDoesNotMatch":
      return "The provided signature does not match the calculated signature.";
    case "AccessDenied":
      return "Access to the specified resource is denied.";
    case "ResourceLocked":
      return "The resource is locked and cannot be altered.";
    case "DatabaseError":
      return "An error occurred while accessing the database.";
    case "MissingContentLength":
      return "The Content-Length header is missing.";
    case "MissingParameter":
      return "A required parameter is missing.";
    case "InvalidUploadSignature":
      return "The provided upload signature is invalid.";
    case "LockTimeout":
      return "A timeout occurred while waiting for a resource lock.";
    case "S3Error":
      return "An error occurred related to Amazon S3.";
    case "S3InvalidAccessKeyId":
      return "The provided AWS access key ID is invalid.";
    case "S3MaximumCredentialsLimit":
      return "The maximum number of credentials has been reached.";
    case "InvalidChecksum":
      return "The checksum of the entity does not match.";
    case "MissingPart":
      return "A part of the entity is missing.";
    case "SlowDown":
      return "The request rate is too high and has been throttled.";
    default:
      return "An unexpected storage error occurred. Please try again.";
  }
}

export function handleSupabaseStorageError(error: unknown) {
  const errorMessage = getSupabaseStorageErrorMessage(error);
  return {
    error: true,
    message: errorMessage,
  };
}
