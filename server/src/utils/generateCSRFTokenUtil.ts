import crypto from "crypto";

function generateCSRFToken() {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const csrfTokenHash = crypto.createHash("sha256").update(csrfToken).digest("hex");

  return {
    "csrfToken": csrfToken,
    "csrfTokenHash": csrfTokenHash
  }
}

export default generateCSRFToken;