  export const modifyStat = ({ accessibleStats, addParam, statKey, increment }) => {

    if(accessibleStats === null) {
      console.log(`Выберите уровень персонажа`);
      return { addParam, accessibleStats }
    }
    const foundParam = addParam.find((p) => p.key === statKey);
    if (!foundParam) {
      return { addParam, accessibleStats };
    }

    if (increment > 0) {

       if (accessibleStats > 0) {
        foundParam.count += increment;
        accessibleStats -= increment;
      } else {
        console.log(`Не достаточно очков`);
      }
    } else {
      if (foundParam.count < 1) {
        if (foundParam.count === 0) {
          console.log(`Значение ${foundParam.key} не может быть меньше базового`);
        }
      } else {
        foundParam.count += increment;
        accessibleStats -= increment;
      }
    }
  
    return { addParam, accessibleStats };
  };
  