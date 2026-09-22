'use strict';

// Same formulas, same numbers, as the published @aadifit/tdee-calc package
// (https://www.npmjs.com/package/@aadifit/tdee-calc) — copied in directly
// since a browser extension popup has no bundler step. MIT licensed, AadiFit.

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

const GOAL_DEFAULTS = {
  cut: { proteinPerKg: 2.2, fatPct: 0.25, kcalAdjustPct: -0.2 },
  maintain: { proteinPerKg: 2.0, fatPct: 0.28, kcalAdjustPct: 0 },
  bulk: { proteinPerKg: 1.8, fatPct: 0.25, kcalAdjustPct: 0.1 }
};

const KCAL_PER_G = { protein: 4, carb: 4, fat: 9 };

function assertPositive(name, value) {
  if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
    throw new TypeError(name + ' must be a positive number');
  }
}

function mifflinStJeor({ weightKg, heightCm, age, sex }) {
  assertPositive('Weight', weightKg);
  assertPositive('Height', heightCm);
  assertPositive('Age', age);
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function katchMcArdle({ weightKg, bodyFatPct }) {
  assertPositive('Weight', weightKg);
  if (typeof bodyFatPct !== 'number' || bodyFatPct < 2 || bodyFatPct >= 70) {
    throw new TypeError('Body fat % must be between 2 and 70');
  }
  const leanMassKg = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * leanMassKg;
}

function harrisBenedict({ weightKg, heightCm, age, sex }) {
  assertPositive('Weight', weightKg);
  assertPositive('Height', heightCm);
  assertPositive('Age', age);
  return sex === 'male'
    ? 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362
    : 9.247 * weightKg + 3.098 * heightCm - 4.330 * age + 447.593;
}

function tdee(bmr, activityLevel) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  if (!multiplier) throw new TypeError('Unknown activity level');
  return bmr * multiplier;
}

function macroSplit(tdeeKcal, { weightKg, goal }) {
  const defaults = GOAL_DEFAULTS[goal];
  if (!defaults) throw new TypeError('Unknown goal');
  const targetKcal = Math.round(tdeeKcal * (1 + defaults.kcalAdjustPct));
  const proteinG = Math.round(defaults.proteinPerKg * weightKg);
  const proteinKcal = proteinG * KCAL_PER_G.protein;
  const fatG = Math.round((targetKcal * defaults.fatPct) / KCAL_PER_G.fat);
  const carbKcal = Math.max(0, targetKcal - proteinKcal - fatG * KCAL_PER_G.fat);
  const carbG = Math.round(carbKcal / KCAL_PER_G.carb);
  return { targetKcal, proteinG, fatG, carbG };
}

// Unit conversions for the popup's kg/lb and cm/in toggles.
const LB_PER_KG = 2.20462262;
const IN_PER_CM = 0.393700787;
const lbToKg = (lb) => lb / LB_PER_KG;
const inToCm = (inch) => inch / IN_PER_CM;
