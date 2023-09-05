import store from '../store'


function updateStats(sourceStatsArray, arrUpdate, includeSummStatBase) {
    return arrUpdate.map((item) => {
      const common = sourceStatsArray.find((i) => i.key === item.key);
      if (common) {
        const updatedItem = {
          ...item,
          summStatBonusAndBase: item.summStatBonusAndBase + common.count
        };
        
        if (includeSummStatBase) {
          updatedItem.summStatBase = item.summStatBase + common.count;
        }
        
        return updatedItem;
      } else {
        return {
          ...item
        };
      }
    });
  }

export function aggregateStatValues({ baseUpdate, idMannequin }) {
  // Очищаем массивы перед началом работы
  let commonStats = [];
  let bonusOllStats = [];
  let arrUpdate = baseUpdate;

  const sumChangeInfo = store.getters['statChange/listStat'](idMannequin);
  // Проходимся по каждому элементу исходного массива
  sumChangeInfo.forEach((item) => {
    const params = item.param;

    params.forEach((paramObj) => {
      // Проверяем, есть ли в объекте 'base' и обрабатываем его
      if (paramObj['base']) {
        paramObj['base'].forEach((param) => {
          const key = param.key;
          const count = param.count;
          const existingStat = bonusOllStats.find((stat) => stat.key === key);

          if (existingStat) {
            existingStat.count += count;
          } else {
            bonusOllStats.push({ key, count });
          }
        });
      }

      // Проверяем, есть ли в объекте 'bonusAndBase' и обрабатываем его
      if (paramObj['bonusAndBase']) {


        paramObj['bonusAndBase'].forEach((param) => {
          const key = param.key;
          const count = param.count;
          const existingStat = commonStats.find((stat) => stat.key === key);

          if (existingStat) {
            existingStat.count += count;
          } else {
            commonStats.push({ key, count });
          }
        });
      }
    });
  });

  // Обновляем статы, если соответствующие массивы не пусты
  if (commonStats.length > 0) {
    arrUpdate = updateStats(commonStats, arrUpdate, false);
  }

  if (bonusOllStats.length > 0) {
    arrUpdate = updateStats(bonusOllStats, arrUpdate, true);
  }

  return { arrUpdate };
}
