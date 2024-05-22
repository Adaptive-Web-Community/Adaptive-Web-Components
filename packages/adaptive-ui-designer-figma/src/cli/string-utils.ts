// https://stackoverflow.com/questions/36658624/how-do-i-convert-a-string-to-spinal-case-in-javasscript
export function spinalCase(str: string) {
  const spinal = str
    .replace(/(?!^)([A-Z])/g, ' $1')
    .replace(/[_\s\.]+(?=[a-zA-Z])/g, '-')
    .toLowerCase();
  return spinal;
}

export function alphabetize(a: string, b: string) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
