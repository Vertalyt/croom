export function baseStatFromLvl() {
    let result = [];
    let baseStat = 3; // Начальное значение стата
    let count = baseStat; // Используемая для увеличения стата внутри цикла
  
    for (let lvl = 0; lvl <= 30; lvl++) {
      result.push({ lvl: lvl, stat: count, disabled: false }); // Добавляем уровень и текущее значение стата в результат
      baseStat += 1; // Увеличиваем начальное значение стата на 1
      count += baseStat; // Увеличиваем текущее значение стата на обновленное начальное значение
    }
    return result;
  }