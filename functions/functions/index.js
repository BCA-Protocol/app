/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Helper function to obfuscate emails
function obfuscateEmail(email) {
  if (email === undefined || email === null) {
    return "n/a";
  }
  const parts = email.split("@");
  let localPart = parts[0];
  if (localPart.length > 2) {
    localPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
  }
  let domainPart = parts[1];
  const domainParts = domainPart.split(".");
  let mainDomain = domainParts[0];
  if (mainDomain.length > 2) {
    mainDomain =
      mainDomain[0] +
      "*".repeat(mainDomain.length - 2) +
      mainDomain[mainDomain.length - 1];
  }
  domainPart = [mainDomain, ...domainParts.slice(1)].join(".");
  return localPart + "@" + domainPart;
}

exports.fetchPaginatedLeaderboard = functions.https.onCall(
  async (data, context) => {
    // You can access call parameters from `data` and authentication context from `context`
    const db = admin.firestore();

    const lastOverallPoints = data.lastOverallPoints;
    const lastCreated = data.lastCreated;

    let query = db
      .collection("users")
      .orderBy("overallPoints", "desc")
      .orderBy("created", "asc")
      .limit(100);

    if (lastOverallPoints !== undefined && lastCreated !== undefined) {
      query = query.startAfter(lastOverallPoints, lastCreated);
    }

    const snapshot = await query.get();
    const users = [];
    snapshot.forEach((doc) => {
      const {
        userId,
        email,
        displayName,
        totalPoints,
        overallPoints,
        referralPoints,
        created,
      } = doc.data();
      const hiddenEmail = obfuscateEmail(email);
      users.push({
        userId,
        email: hiddenEmail,
        displayName,
        totalPoints,
        overallPoints,
        referralPoints,
        created,
      });
    });

    // Assuming you're using the last user of the current batch for the next pagination cursor
    const lastUser = users[users.length - 1];
    return { users, lastUser };
  }
);
