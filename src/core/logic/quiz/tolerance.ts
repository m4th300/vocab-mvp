// Damerau–Levenshtein distance (transposition autorisée)
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  const dp: number[][] = Array.from({ length: al + 1 }, () =>
    Array(bl + 1).fill(0)
  );
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[al][bl];
}

export function isAlmostCorrect(
  input: string,
  expected: string,
  hardcore = false
): { ok: boolean; almost: boolean } {
  const i = normalize(input);
  const e = normalize(expected);
  if (hardcore) return { ok: i === e, almost: false };

  if (i === e) return { ok: true, almost: false };

  const dist = damerauLevenshtein(i, e);
  const threshold = Math.max(1, Math.round(e.length / 5));
  const almost = dist <= threshold;
  return { ok: false, almost };
}

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
