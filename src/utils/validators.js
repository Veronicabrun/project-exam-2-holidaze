export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isStudNoroffEmail(value) {
  return String(value).trim().toLowerCase().endsWith("@stud.noroff.no");
}

export function isValidPassword(value) {
  return String(value).length >= 8;
}

export function isValidName(value) {
  return String(value).trim().length >= 3;
}