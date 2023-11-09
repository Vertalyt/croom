import store from '../store'

function updateStats(sourceStatsArray, arrUpdate, includeSummStatBase) {

  return arrUpdate.map((item) => {
    const common = sourceStatsArray.find((i) => i.key === item.key)
    if (common) {
      const updatedItem = {
        ...item,
        summStatBonusAndBase: item.summStatBonusAndBase + common.count
      }

      if (includeSummStatBase) {
        updatedItem.summStatBase = item.summStatBase + common.count
      }

      return updatedItem
    } else {
      return {
        ...item
      }
    }
  })
}


export function aggregateStatValues({ baseUpdate, idMannequin }) {
  let commonStats = []
  let bonusOllStats = []
  let arrUpdate = baseUpdate
  const sortedChangesByType = ['freeStats', 'subclass', 'elixStats']

  // Получаем данные изменений статистики из хранилища по идентификатору манекена
  const sumChangeInfo = store.getters['statChange/listStat'](idMannequin)

  // Фильтруем изменения статистики по заданным типам и получаем массив sorted
  const sorted = sumChangeInfo.filter((item) => {
    return sortedChangesByType.some((changeType) => item.type.includes(changeType))
  })
;

  // Обработка 'base' из массива sorted (необходимо для отбраковки базовых стат от вещей)
  processBase(sorted, bonusOllStats)

  // Обработка 'bonusAndBase' из массива sumChangeInfo
  processBonusAndBase(sumChangeInfo, commonStats)

  // Обновляем статы, если соответствующие массивы не пусты
  if (commonStats.length > 0) {
    arrUpdate = updateStats(commonStats, arrUpdate, false)
  }

  if (bonusOllStats.length > 0) {
    arrUpdate = updateStats(bonusOllStats, arrUpdate, true)
  }

  return { arrUpdate }
}

// Функция для обработки 'base'
function processBase(sorted, bonusOllStats) {
  sorted.forEach((item) => {
    const params = item.param

    params.forEach((paramObj) => {
      if (paramObj['base']) {
        paramObj['base'].forEach((param) => {
          const key = param.key
          const count = param.count
          const existingStat = bonusOllStats.find((stat) => stat.key === key)

          if (existingStat) {
            existingStat.count += count
          } else {
            bonusOllStats.push({ key, count })
          }
        })
      }
    })
  })
}

// Функция для обработки 'bonusAndBase'
function processBonusAndBase(sumChangeInfo, commonStats) {
  sumChangeInfo.forEach((item) => {
    const params = item.param
    params.forEach((paramObj) => {
      if (paramObj['bonusAndBase']) {
        paramObj['bonusAndBase'].forEach((param) => {
          const key = param.key
          const count = param.count
          const existingStat = commonStats.find((stat) => stat.key === key)

          if (existingStat) {
            existingStat.count += count
          } else {
            commonStats.push({ key, count })
          }
        })
      }
    })
  })
}
