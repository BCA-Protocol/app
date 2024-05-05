export async function verifyEmail(verificationCode) {
  const apiKey = process.env.FIREBASE_APIKEY; // Replace with your actual API key

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oobCode: verificationCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}
