export function pickCard(x: { suit: string; card: number }[]): number;
export function pickCard(x: number): { suit: string; card: number };
export function pickCard(x): any {
  if (typeof x === 'object') {
    return 'pickedCard';
  } else if (typeof x === 'number') {
    return 'b'
  }
  return 'a';
}


