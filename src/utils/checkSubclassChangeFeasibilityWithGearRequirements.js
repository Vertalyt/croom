import store from '../store/index'
import { recalculationValues } from './updatedStats'

// проверка значений возможности смены подкласса, в зависимости от минимальных стат одежды
export function checkSubclassChangeFeasibilityWithGearRequirements({id, ollParamClass, parent}) {
  let availabilityFlag = true 
  
  
  const listStat = store.getters['statChange/listStat'](id)
  const subclass = listStat.find((item) => item.type === 'subclass')
  if (subclass && subclass.param) {
    // Найдем объект с ключом "base" в массиве "param"
    const baseObject = subclass.param.find((obj) => obj.base).base
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
    // массив с требониями класа, что нужно автоматически распределить
    const addClassMinParam = [
      { key: 'minstrength', count: 0 },
      { key: 'mindexterity', count: 0 },
      { key: 'minreaction', count: 0 },
      { key: 'minconst', count: 0 },
      { key: 'minintel', count: 0 },
      { key: 'minwisdom', count: 0 },
      { key: 'minluck', count: 0 }
    ]

    recalculationValues({ ollParamClass, parent, items: addClassMinParam })
    const updateMinParam = addClassMinParam.map((item) => {
        switch (item.key) {
          case 'minstrength':
            return { key: 'dstrength', count: item.count }
          case 'mindexterity':
            return { key: 'ddexterity', count: item.count }
          case 'minreaction':
            return { key: 'dreaction', count: item.count }
          case 'minconst':
            return { key: 'dconst', count: item.count }
          case 'minintel':
            return { key: 'dintel', count: item.count }
          case 'minwisdom':
            return { key: 'dwisdom', count: item.count }
          case 'minluck':
            return { key: 'dluck', count: item.count }
          default:
            return item
        }
      })
    // Вычислить разницу между требованиями нового и текущего подкласса
    const difference = {}
        baseObject.forEach((req) => {
          const matchingNewReq = updateMinParam.find((newReq) => newReq.key === req.key)
          if (matchingNewReq) {
            difference[req.key] = req.count - matchingNewReq.count
          }
        })
    // Вычесть разницу из базовых стат
    const updatedBaseStats = baseParamManecken.map((stat) => {
      const diff = difference[stat.key] || 0
      return {
        ...stat,
        summStatBase: stat.summStatBase - diff
      }
    })

    // Сравнить с требованиями одежды и вывести сообщение
    sorted.forEach((item) => {
      const base = item.base
      base.forEach((baseItem) => {
        const matchingStat = updatedBaseStats.find((stat) => stat.key === baseItem.key)
        if (matchingStat && matchingStat.summStatBase <= baseItem.count) {
          console.log(`Не возможно понизить ${matchingStat.key}, требования вещи ${item.type} больше.`)
          availabilityFlag = false
        }
      })
    })
  }
  return availabilityFlag
}
