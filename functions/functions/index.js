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
const db = admin.firestore();
const { increment } = admin.firestore.FieldValue;

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

const distributeReferralPoints = async (referrals, taskName) => {
  const batch = db.batch();
  

  for (const referral of referrals) {
    const { userId, points, referrals } = referral;
    const newPoints = points * 0.1; // 10% of points for each level up

    for (const referrerId of referrals) {
      // const settingsDocRef = doc(db, "general", "settings");
      const settingsDocRef = db.collection("general").doc("settings");
      const referrerQuery = db.collection('users').where('userId', '==', referrerId);
      const referrerSnap = await referrerQuery.get();
      if (!referrerSnap.empty) {
        const referrerDoc = referrerSnap.docs[0];
        const referrerRef = referrerDoc.ref;
        // Update the user's points in the batch
        batch.update(referrerRef, {
          referralPoints: increment(newPoints),
          overallPoints: increment(newPoints),
        });
        batch.update(settingsDocRef, {
          protocolPoints: increment(newPoints),
        });
        // Add records to a usersPoints collection
        const usersPointsCollection = db.collection("usersPoints");
        batch.set(usersPointsCollection.doc(), {
          userId: referrerId,
          points: newPoints,
          description: `${taskName} (Referral)`,
          created: admin.firestore.Timestamp.now(),
        });
        console.log("updated userpoints");
      }
    }
  }

  await batch.commit();
};

exports.scheduledReferralPointsDistribution = functions.pubsub.schedule('0 2 * * *').timeZone('UTC').onRun(async (context) => {
  const db = admin.firestore();
  const usersPointsRef = db.collection('usersPoints');
  const usersRef = db.collection('users');

  try {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const startOfYesterday = admin.firestore.Timestamp.fromDate(new Date(yesterday.setUTCHours(0, 0, 0, 0)));
    const endOfYesterday = admin.firestore.Timestamp.fromDate(new Date(yesterday.setUTCHours(24, 0, 0, 0)));

    // Get all points for the previous day with description "smartCookieConnection"
    const userPointsSnapshot = await usersPointsRef
      .where("description", "==", "Smart Cookie Connection")
      .where("created", ">=", startOfYesterday)
      .where("created", "<", endOfYesterday)
      .get();

    if (userPointsSnapshot.empty) {
      console.log('No points found for the given description.');
      return null;
    }

    const userPointsMap = {};

    // Aggregate points for each userId
    userPointsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!userPointsMap[data.userId]) {
        userPointsMap[data.userId] = 0;
      }
      userPointsMap[data.userId] += data.points;
    });

    const referrals = [];

    // Check if userId has referrals and prepare the referral list
    for (const userId in userPointsMap) {
      const userDocSnapshot = await usersRef.where('userId', '==', userId).get();
      if (!userDocSnapshot.empty) {
        const userDoc = userDocSnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.referrals && userData.referrals.length > 0) {
          referrals.push({ userId, points: userPointsMap[userId], referrals: userData.referrals });
        }
      }
    }

    console.log('Referrals Object', referrals)

    // Distribute the points
    await distributeReferralPoints(referrals, "Smart Cookie Connection");

    console.log('Referral points distribution completed successfully.');
    return null;

  } catch (error) {
    console.error('Error distributing referral points:', error);
    throw new functions.https.HttpsError('internal', 'Error distributing referral points');
  }
});