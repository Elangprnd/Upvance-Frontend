/**
 * Utility: Password Strength Checker
 * Digunakan baik di sisi klien (register form) maupun di server (API route).
 * Tidak ada dependency eksternal — aman untuk diimport di mana saja.
 */

export interface PasswordStrengthResult {
  score: number;
  strength: "weak" | "medium" | "strong";
  feedback: string[];
  color: string;
  label: string;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push("Minimal 8 karakter");

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Huruf kapital (A-Z)");

  if (/[a-z]/.test(password)) score++;
  else feedback.push("Huruf kecil (a-z)");

  if (/[0-9]/.test(password)) score++;
  else feedback.push("Angka (0-9)");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push("Karakter spesial (!@#$%)");

  if (score <= 2)
    return { score, strength: "weak", feedback, color: "bg-red-500", label: "Lemah" };
  if (score <= 4)
    return { score, strength: "medium", feedback, color: "bg-yellow-500", label: "Sedang" };
  return { score, strength: "strong", feedback: [], color: "bg-green-500", label: "Kuat" };
}
