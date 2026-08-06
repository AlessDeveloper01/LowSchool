export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface PasswordEvaluation {
  score: number;
  percentage: number;
  passedRules: string[];
  label: string;
}

export const defaultPasswordRules: readonly PasswordRule[] = [
  {
    id: "length",
    label: "Al menos 8 caracteres",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Una letra mayúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Una letra minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Un número",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "Un símbolo",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const strengthLabels = [
  "Sin contraseña",
  "Muy débil",
  "Débil",
  "Aceptable",
  "Fuerte",
  "Excelente",
] as const;

export function evaluatePasswordStrength(
  password: string,
  rules: readonly PasswordRule[] = defaultPasswordRules,
): PasswordEvaluation {
  const passedRules = rules
    .filter((rule) => rule.test(password))
    .map((rule) => rule.id);

  if (rules.length === 0) {
    const score = password.length === 0 ? 0 : 5;
    return {
      score,
      percentage: score === 0 ? 0 : 100,
      passedRules,
      label: strengthLabels[score] ?? strengthLabels[5],
    };
  }

  const score =
    password.length === 0
      ? 0
      : Math.max(1, Math.round((passedRules.length / rules.length) * 5));

  return {
    score,
    percentage: (passedRules.length / rules.length) * 100,
    passedRules,
    label: strengthLabels[score] ?? strengthLabels[5],
  };
}
