import { takeCoffeeBreak } from '../../services/coffee-break.js';

export async function handleCoffeeBreak(
  userId?: string,
  durationMinutes?: number,
): Promise<string> {
  return takeCoffeeBreak(userId, durationMinutes);
}
