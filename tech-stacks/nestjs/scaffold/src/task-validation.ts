import { BadRequestException } from '@nestjs/common';

export function parseTaskId(raw: string): number {
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) throw new BadRequestException('invalid id');
  return id;
}
export function parseTaskTitle(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 200) {
    throw new BadRequestException('title is required');
  }
  return value.trim();
}
