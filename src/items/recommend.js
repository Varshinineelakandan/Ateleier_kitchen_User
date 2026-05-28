// ─── Shared scorer (used by all three functions) ───────────────────
function scoreItem(dish, prefs) {
  let score = 0;

  if (
    prefs.diet === "Vegetarian" &&
    (dish.veg_nonveg === "Veg" || dish.veg_nonveg === "Vegetarian")
  ) score += 5;

  if (
    prefs.diet === "Non-veg" &&
    (dish.veg_nonveg === "Non-Veg" || dish.veg_nonveg === "Non vegetarian")
  ) score += 5;

  if (prefs.spice && prefs.spice === dish.spice_level) score += 4;

  if (prefs.budget && prefs.budget === dish.price_range) score += 3;

  return score;
}

// ─── Helper to detect dessert (handles the "desert" typo in your data) ───
function isDessert(item) {
  const cat = item.category?.toLowerCase();
  return cat === "dessert" || cat === "desert";
}

function isJuice(item) {
  return item.category?.toLowerCase() === "juice";
}

function isMainCourse(item) {
  return !isDessert(item) && !isJuice(item);
}

// ─── 1. MAIN COURSE ────────────────────────────────────────────────
export function recommendDishes(data, prefs) {
  const mainItems = data.filter(isMainCourse);

  if (!prefs) return mainItems.slice(0, 10);

  const scored = mainItems
    .map((dish) => {
      let score = scoreItem(dish, prefs);

      // hunger maps to category e.g. "South Indian", "Fast Food" etc.
      if (prefs.hunger && prefs.hunger === dish.category) score += 4;

      return { ...dish, score };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // fallback: if nothing matched, return top-rated main items
  return scored.length > 0 ? scored : mainItems.slice(0, 10);
}

// ─── 2. DESSERTS ───────────────────────────────────────────────────
export function recommendDesserts(data, prefs) {
  const dessertItems = data.filter(isDessert);

  if (!prefs) return dessertItems.slice(0, 10);

  const scored = dessertItems
    .map((dish) => {
      let score = scoreItem(dish, prefs);

      // meal_time match — also accept "Anytime" desserts always
      if (
        prefs.meal_time &&
        (dish.meal_time === prefs.meal_time || dish.meal_time === "Anytime")
      ) score += 2;

      return { ...dish, score };
    })
    .sort((a, b) => b.score - a.score) // ✅ NO .filter(score > 0) for desserts
    .slice(0, 10);                      //    so you always get results

  return scored;
}

// ─── 3. JUICES ─────────────────────────────────────────────────────
export function recommendJuices(data, prefs) {
  const juiceItems = data.filter(isJuice);

  if (!prefs) return juiceItems.slice(0, 10);

  const scored = juiceItems
    .map((dish) => {
      let score = scoreItem(dish, prefs);

      if (
        prefs.meal_time &&
        (dish.meal_time === prefs.meal_time || dish.meal_time === "Anytime")
      ) score += 2;

      return { ...dish, score };
    })
    .sort((a, b) => b.score - a.score) // ✅ NO .filter() — always show juices
    .slice(0, 10);

  return scored;
}