// Validation helpers for scenario inputs

export function validateToHit(value: number): boolean {
  return value >= 2 && value <= 6 && Number.isInteger(value);
}

export function validateSave(value: number): boolean {
  return value >= 2 && value <= 6 && Number.isInteger(value);
}

export function validatePositive(value: number): boolean {
  return value > 0;
}

export function validateNonNegative(value: number): boolean {
  return value >= 0;
}

export function validateModelCount(value: number): boolean {
  return value > 0 && Number.isInteger(value);
}

export function validateDiceNotation(value: string): boolean {
  const trimmed = value.trim().toUpperCase();
  
  // Allow plain numbers
  if (!isNaN(parseFloat(trimmed))) return true;
  
  // Allow D3, D6, 2D3, 2D6, etc.
  if (/^\d*D\d+$/.test(trimmed)) return true;
  
  return false;
}
