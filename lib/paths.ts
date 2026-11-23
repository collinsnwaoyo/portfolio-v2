export const BASE_PATH = '/portfolio-v2';

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
