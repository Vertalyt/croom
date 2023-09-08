import store from '../store/index'

function checkingStatAvailability(id) {
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

// флаг разрешения на понижения стат
let availabilityFlag = true
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
{
  addParam,
  foundOllParam,
  foundParam,
  accessibleStats,
  minParamCloth,
  minParamsWithoutRaceBonus,
  statKey,
  increment,
  id
}
    )
  }
}

// положительый изменения
function handleIncrement(addParam, foundParam, accessibleStats, increment) {
  if (accessibleStats > 0) {
    availabilityFlag = true
    foundParam.count += increment
    accessibleStats -= increment
  } else {
    console.log(`Не достаточно очков`)
  }
  return { addParam, accessibleStats }
}

// отрицательные изменения
function handleDecrement(
{
  addParam,
  foundOllParam,
  foundParam,
  accessibleStats,
  minParamCloth,
  minParamsWithoutRaceBonus,
  statKey,
  increment,
  id
}
) {


  if (minParamCloth.length > 0) {
    const minParamSubclass = minParamCloth.find((item) => item.type === 'subclass')?.base

    if (minParamSubclass) {
      handleDecrementSubclass(
        minParamsWithoutRaceBonus,
        minParamSubclass,
        statKey
      )
    }

    // тут же делать подобную проверку для вещей-------
    checkStatRequirementsForClothing(statKey, id)

    if (availabilityFlag) {
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
  minParamsWithoutRaceBonus.find((minParamsItem) => {
    const minParamSubclassItem = minParamSubclass.find((item) => item.key === minParamsItem.key)
    if (minParamSubclassItem) {
      // сравниваю требования для подкласса и текущие распределенные базовые статы, если меньше, запрещаю обновление
      if (minParamsItem.count <= minParamSubclassItem.count) {
        if (statKey === minParamsItem.key) { // проверка что передаваемый стат именно тот что жмем
          console.log(
            `Нельзя понизить характеристику "${minParamsItem.key}", будет ниже требований подкласса`
          )
          availabilityFlag = false
        }
      }
    }
  })
}

// беру базовые статы персонажа, сравниваю их с требованиями надетой одежды, 
// и если требования ниже, запрещаю понижать базовые характеристики персонажа
function checkStatRequirementsForClothing(statKey, id) {
      // получаю имена вещей
      const listClothName = store.getters['dummy/clothName']
      // получаю значения требований вещей по базовым статам
      const minParamBase = store.getters['statChange/minParamCloth'](id)
      //получаю сами распредленные базовые статы
      const baseParamManecken = store.getters['listManekenBase'](id)
  
      // oтсортировую требований по базовым статам, оставляя только одежду
      const sorted = minParamBase.filter((item) => {
        return listClothName.some((changeType) => item.type.includes(changeType))
      })

      // проверяю соответствуют ли базовые статы требованиям вещей
      sorted.forEach(item => {
        const base = item.base;
        base.forEach(baseItem => {
          const matching = baseParamManecken.find(manecken => manecken.key === baseItem.key);
    
          if (matching && matching.summStatBase <= baseItem.count) {
            if (statKey === baseItem.key) {
              console.log(`Не возможно понизить ${statKey}, требования вещи ${item.type} больше.`);
              availabilityFlag = false
            }
          }
        });
      })
}