

export function updatedBaseStats({ arrMinParam, ollStats }) {
    return arrMinParam.map((item) => {
        const matchingConfig = ollStats.find(
          (statConfig) => statConfig.key === item.key
        )
        if (matchingConfig) {
          const diff =
            matchingConfig.summStatBase < item.count ? item.count - matchingConfig.summStatBase : 0
          return {
            key: item.key,
            count: diff
          }
        }
        return item
      })
} 

export function recalculationValues({ ollParamClass, parent, items }) {
    //нахожу какая конкретно расса, для расчета сколько нужно потратить и распределить стат для
    // выполнения минимальных требований подкласса
    const parentClassItem = ollParamClass.filter((p) => p.name_en === parent)
    for (const item of parentClassItem) {
      // Перебираем элементы массива
      for (const param of items) {
        // Если значения ключей совпадают и значение не равно null
        if (item[param.key] !== null) {
          param.count = parseInt(item[param.key]) // Преобразуем значение в число и записываем в count
        }
      }
    }

    return parentClassItem
  }