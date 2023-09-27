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
let avaiStatFlag = true

// функция расчета изменения статов.
export const modifyStat = ({ accessibleStats, addParam, statKey, increment, id }) => {
  if (accessibleStats === null) {
    store.dispatch('setMessage', `Выберите уровень персонажа`)
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
    store.dispatch('setMessage', `Не достаточно очков`)
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
    // ищу записи о подклассе
    let minParamSubclass = minParamCloth.find((item) => item.type === 'subclass')?.base
        // ищу записи о эликсирах
    const elixStats = minParamCloth.find((item) => item.type === 'elixStats')?.base
      if(elixStats && minParamSubclass) {
        minParamSubclass = minParamSubclass.map(item => {
          const coincidence = elixStats.find(e => e.key === item.key)
          if(coincidence) {
            return {
              ...item,
              count: item.count + coincidence.count
            }
          } else {
            return item
          }
        })
      }
      //получаю сами распредленные базовые статы
      const baseParamManecken = store.getters['listManekenBase'](id)
    // тут же делать подобную проверку для вещей-------
    avaiStatFlag = checkStatRequirementsForClothing(id, baseParamManecken, statKey)



    if (minParamSubclass) {
      availabilityFlag = handleDecrementSubclass(
        minParamsWithoutRaceBonus,
        minParamSubclass,
        statKey
      )
    }
    if (availabilityFlag === true && avaiStatFlag === true) {
      // смотрю в foundOllParam все распределенные статы,
      if (foundOllParam.count < 1) {
        if (foundOllParam.count === 0) {
          store.dispatch('setMessage', `Значение ${foundParam.key} не может быть меньше базового`)
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
  let flag = true;
  minParamsWithoutRaceBonus.find((minParamsItem) => {

    const minParamSubclassItem = minParamSubclass.find((item) => item.key === minParamsItem.key)

    if (minParamSubclassItem) {
      // сравниваю требования для подкласса и текущие распределенные базовые статы, если меньше, запрещаю обновление
      if (minParamsItem.count <= minParamSubclassItem.count) {
        if (statKey === minParamsItem.key) { // проверка что передаваемый стат именно тот что жмем
          store.dispatch('setMessage', `Нельзя понизить характеристику "${minParamsItem.key}", будет ниже требований подкласса`)
          flag = false
        }
      }
    }
  })
  return flag
}

// беру базовые статы персонажа, сравниваю их с требованиями надетой одежды, 
// и если требования ниже, запрещаю понижать базовые характеристики персонажа
export function checkStatRequirementsForClothing(id, baseParamManecken, statKey = null) {
  let flag = true
  const listClothName = store.getters['dummy/clothName'];
  const minParamBase = store.getters['statChange/minParamCloth'](id);

  const sorted = minParamBase.filter((item) => {
    return listClothName.some((changeType) => item.type.includes(changeType));
  });

  sorted.forEach((item) => {
    const base = item.base;


    base.forEach((baseItem) => {
      const matchingStat = baseParamManecken.find((stat) => stat.key === baseItem.key);


      if (matchingStat && matchingStat.summStatBase <= baseItem.count) {
        if (statKey && statKey === baseItem.key) {
          store.dispatch('setMessage', `Не возможно понизить ${statKey}, требования вещи ${item.type} больше.`)
          flag = false;
        } if (statKey === null) {
          store.dispatch('setMessage', `Не возможно понизить ${matchingStat.key}, требования вещи ${item.type} больше.`)
          flag = false;
        }
      }
    });
  });
  return flag
}

export function statInputChange({ stat, statParams, accessibleStats }) {

  // изменение стат через инпут
  const oldBaseStat = statParams.find((s) => s.key === stat.key).summStatBase // ищу предыдущие значение стата
  let statChange = Number(stat.summStatBase) - Number(oldBaseStat) //высчитываю разницу, на которое буду изменять
  if (accessibleStats < statChange) {
    statChange = accessibleStats // при избыточной разнице
  }
  return {key: stat.key , statChange  }
}