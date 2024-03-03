import { arrayVariableStats } from '../initialization/baseParams'


export function distributedStatuses(statChange) {
    // проверяю, добавлялись ли ранее статы шмотками или статами
  const freeStatFound = statChange.find((item) => item.type === 'freeStats')
  // Массив с изменениями параметров
  if (freeStatFound) {
    return freeStatFound.param[0].base
  } else {
    return arrayVariableStats
  }
}