/** Every tunable number used by the calculator. Change values here, not in code. */
export const nutritionConfig = {
  /** Activity multiplier by gym days per week (index = days, 0–7). */
  activityByGymDays: [1.2, 1.375, 1.375, 1.55, 1.55, 1.725, 1.725, 1.9],
  goal: {
    bulk: { calorieDelta: 300, calorieFactor: 1, proteinPerKg: 1.8 },
    cut: { calorieDelta: 0, calorieFactor: 0.8, proteinPerKg: 2.0 },
    maintain: { calorieDelta: 0, calorieFactor: 1, proteinPerKg: 1.6 },
    healthy: { calorieDelta: 0, calorieFactor: 1, proteinPerKg: 1.2 },
  },
  fatShare: 0.25,
  calorieFloor: { male: 1500, female: 1200 },
  kcalPerGram: { protein: 4, carbs: 4, fat: 9 },
  limits: {
    age: { min: 16, max: 80 },
    heightCm: { min: 120, max: 230 },
    weightKg: { min: 35, max: 250 },
  },
  /** Sizing a sample day of menu meals to the targets (see `matchDay`). */
  matching: {
    /** Portion sizes the kitchen can make, as multiples of a regular meal. */
    portions: [0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5],
    /**
     * How much each squared relative miss counts. Calories matter most. Protein only
     * counts when it falls short: going over the target is fine.
     */
    weights: { calories: 10, proteinShortfall: 4, fat: 0.5, carbs: 0.5 },
    /** Weight on the squared gap between the largest and smallest portion, for even portions. */
    portionSpread: 0.4,
  },
} as const;
