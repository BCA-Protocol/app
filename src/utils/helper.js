export const changeTheme = (theme) => {
  document.querySelector("html")?.setAttribute("data-theme", theme);
};

export function formatLargeNumber(theNumber) {
  return new Intl.NumberFormat('en-US').format(theNumber);
}