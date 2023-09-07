import store from '../store/index'

export function checkingStatAvailability(id) {
  const minParamRase = store.getters['listManeken'](id)
  const countParam = minParamRase.raseParams
  const statEditParam = minParamRase.statModule
  const outputArray = statEditParam.map((item) => {
    return {
      key: item.key,
      count: item.summStatBase
    }
  })
  const filteredOutputArray = outputArray.filter((item) => item.count !== 0)
  // Создаю новый массив с разницей только для ключей, которые есть в отфильтрованном массиве
  return filteredOutputArray.map((item) => {
    const countParamItem = countParam.find((param) => param.key === item.key)
    if (countParamItem) {
      return {
        key: item.key,
        count: item.count - countParamItem.count
      }
    }
    return item
  })
}

// функция расчета изменения статов.
export const modifyStat = ({ accessibleStats, addParam, statKey, increment, id }) => {
  if (accessibleStats === null) {
    console.log(`Выберите уровень персонажа`)
    return { addParam, accessibleStats }
  }

  const minParamCloth = store.getters['statChange/minParamCloth'](id)
  const minParamsWithoutRaceBonus = checkingStatAvailability(id)

  const foundOllParam = minParamsWithoutRaceBonus.find((p) => p.key === statKey)
  const foundParam = addParam.find((p) => p.key === statKey)

  if (!foundParam) {
    return { addParam, accessibleStats }
  }

  if (increment > 0) {
    return handleIncrement(addParam, foundParam, accessibleStats, increment)
  } else {
    return handleDecrement(
      addParam,
      foundOllParam,
      foundParam,
      accessibleStats,
      minParamCloth,
      minParamsWithoutRaceBonus,
      statKey,
      increment
    )
  }
}

// положительый изменения
function handleIncrement(addParam, foundParam, accessibleStats, increment) {
  if (accessibleStats > 0) {
    foundParam.count += increment
    accessibleStats -= increment
  } else {
    console.log(`Не достаточно очков`)
  }
  return { addParam, accessibleStats }
}

// отрицательные изменения
function handleDecrement(
  addParam,
  foundOllParam,
  foundParam,
  accessibleStats,
  minParamCloth,
  minParamsWithoutRaceBonus,
  statKey,
  increment
) {

  let availabilityFlag = true

  if (minParamCloth.length > 0) {
    const minParamSubclass = minParamCloth.find((item) => item.type === 'subclass')?.base
// тут же делать подобную проверку для вещей
    if (minParamSubclass) {
      availabilityFlag = handleDecrementSubclass(minParamsWithoutRaceBonus, minParamSubclass, statKey)
    }
       
    
    if(availabilityFlag) {
              // смотрю в foundOllParam все распределенные статы,
              if (foundOllParam.count < 1) {
                if (foundOllParam.count === 0) {
                  console.log(`Значение ${foundParam.key} не может быть меньше базового`)
                }
              } else {
                foundParam.count += increment
                accessibleStats -= increment
              }
            }
  }
  return { addParam, accessibleStats }
}


function handleDecrementSubclass(minParamsWithoutRaceBonus, minParamSubclass, statKey) {
    minParamsWithoutRaceBonus.map((minParamsItem) => {
      const minParamSubclassItem = minParamSubclass.find((item) => item.key === minParamsItem.key)
      if (minParamSubclassItem) {
        // сравниваю требования для подкласса и текущие распределенные базовые статы, если меньше, запрещаю обновление
        if (minParamsItem.count <= minParamSubclassItem.count) {
          if (statKey === minParamsItem.key) {
            console.log(
              `Нельзя понизить характеристику "${minParamsItem.key}", будет ниже требований подкласса`
            )
            return false
          }
        }
      }
    })
}