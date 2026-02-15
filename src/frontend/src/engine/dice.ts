// Dice notation parsing and averaging utilities

export function parseAttacks(attacks: number | string): number {
  if (typeof attacks === 'number') return attacks;
  
  const str = attacks.trim().toUpperCase();
  
  // D3 = average of 1,2,3 = 2
  if (str === 'D3') return 2;
  
  // D6 = average of 1,2,3,4,5,6 = 3.5
  if (str === 'D6') return 3.5;
  
  // 2D3 = 2 * 2 = 4
  if (str === '2D3') return 4;
  
  // 2D6 = 2 * 3.5 = 7
  if (str === '2D6') return 7;
  
  // 3D6 = 3 * 3.5 = 10.5
  if (str === '3D6') return 10.5;
  
  // Pattern: XDY where X is multiplier, Y is die size
  const match = str.match(/^(\d+)D(\d+)$/);
  if (match) {
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    return count * ((sides + 1) / 2);
  }
  
  // Try parsing as plain number
  const num = parseFloat(str);
  return isNaN(num) ? 1 : num;
}

export function calculateAverageDamage(damage: number | string): number {
  if (typeof damage === 'number') return damage;
  
  const str = damage.trim().toUpperCase();
  
  if (str === 'D3') return 2;
  if (str === 'D6') return 3.5;
  if (str === '2D3') return 4;
  if (str === '2D6') return 7;
  if (str === '3D6') return 10.5;
  
  // Pattern: XDY
  const match = str.match(/^(\d+)D(\d+)$/);
  if (match) {
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    return count * ((sides + 1) / 2);
  }
  
  const num = parseFloat(str);
  return isNaN(num) ? 1 : num;
}

export function rollDice(notation: number | string): number {
  if (typeof notation === 'number') return notation;
  
  const str = notation.trim().toUpperCase();
  
  // D3: roll 1-3
  if (str === 'D3') return Math.floor(Math.random() * 3) + 1;
  
  // D6: roll 1-6
  if (str === 'D6') return Math.floor(Math.random() * 6) + 1;
  
  // Pattern: XDY
  const match = str.match(/^(\d+)D(\d+)$/);
  if (match) {
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  }
  
  const num = parseFloat(str);
  return isNaN(num) ? 1 : Math.round(num);
}
