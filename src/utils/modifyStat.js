

export const modifyStat = ({accessibleStats, addParam, statKey, increment}) => {
    // increment величина изменения, 
    // accessibleStats количество доступных статов, 
    // addParam массив со всеми измененнми статами

    // получаем строку с параметрами мдля изменения
    const foundParam = addParam.find((p) => p.key === statKey);
    if (!foundParam) {
      return {addParam, accessibleStats};
    }

    if (increment > 0) {
        if (accessibleStats === 0) {
            console.log(`Выберите уровень персонажа`);
            return {addParam, accessibleStats}
          } else if  (accessibleStats > 2) {
        foundParam.count += 1;
        accessibleStats -= 3;
      } else if (accessibleStats >0 && accessibleStats < 2) {
        console.log(`Не достаточно очков`);
      }
    } else {
      if (foundParam.count < 1) {
        if (accessibleStats === 0) {
            console.log(`Выберите уровень персонажа`);
            return {addParam, accessibleStats}
          }
        console.log(`Значение ${foundParam.key} не может быть меньше базового`);
        return {addParam, accessibleStats};
      }
  
      if (accessibleStats > -1) {
        foundParam.count -= 1;
        accessibleStats += 3;
      }
    }
  return {addParam, accessibleStats}
  };