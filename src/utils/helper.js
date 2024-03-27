export const changeTheme = (theme) => {
  document.querySelector("html")?.setAttribute("data-theme", theme);
};

export function formatLargeNumber(theNumber) {
  return new Intl.NumberFormat("en-US").format(theNumber);
}

export function collectBrowserData() {
  return {
    screenHeight: window.screen.height ?? "unknown",
    screenWidth: window.screen.width ?? "unknown",
    windowInnerHeight: window.innerHeight ?? "unknown",
    windowInnerWidth: window.innerWidth ?? "unknown",
    userAgent: navigator.userAgent ?? "unknown",
    language: navigator.language ?? "unknown",
    platform: navigator.platform ?? "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown",
    cookiesEnabled: (navigator.cookieEnabled !== undefined
      ? navigator.cookieEnabled
      : "unknown"
    ).toString(),
    doNotTrack:
      navigator.doNotTrack ||
      window.doNotTrack ||
      navigator.msDoNotTrack ||
      "unknown",
    touchSupport:
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
        ? "supported"
        : "not supported",
  };
}

export async function fetchIPAddress() {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
}
