import { takeCoffeeBreak } from '../../services/coffee-break.js';

export async function handleCoffeeBreak(
  userId?: string,
  durationSeconds: number,
): Promise<string> {
  return takeCoffeeBreak(userId, durationSeconds);
}
