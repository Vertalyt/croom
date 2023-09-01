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

export function aggregateStatValues({baseUpdateRase }) {
    // Очищаем массивы перед началом работы
    let commonStats = []
    let bonusOllStats = []
    let arrUpdate = baseUpdateRase
  
  const sumChangeInfo = store.getters['listStatObjects/listStatChange']

    // Проходимся по каждому элементу исходного массива
    sumChangeInfo.forEach((item) => {
      const baseAndCommonStats = item.baseAndCommonStats
      const params = item.param
      // commonStats добавлять только в Базовые.
      // bonusOllStats добавлять и в Бонусы и в Базовые
      // Выбираем нужный массив в зависимости от значения baseAndCommonStats
      const resultArray =
        baseAndCommonStats === 'bonusAndBase'
          ? commonStats
          : baseAndCommonStats === 'oll'
          ? bonusOllStats
          : null
  
      if (resultArray) {
        // Суммируем значения статов для текущего элемента
        params.forEach((param) => {
          const key = param.key
          const count = param.count
          const existingStat = resultArray.find((stat) => stat.key === key)
  
          if (existingStat) {
            existingStat.count += count
          } else {
            resultArray.push({ key, count })
          }
        })
      }
    })
  
    if (commonStats) {
    //     // Суммируем значения статов для текущего элемента
    arrUpdate = updateStats(commonStats, arrUpdate, false);
    }
  
    if (bonusOllStats) {
    //   // Выводим результаты
    arrUpdate = updateStats(bonusOllStats, arrUpdate, true);
    }

    return { arrUpdate }
  }
  