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
       if (accessibleStats > 2) {
        foundParam.count += increment;
        accessibleStats -= increment * 3;
      } else if (accessibleStats > 0 && accessibleStats < 2) {
        console.log(`Не достаточно очков`);
      }
    } else {
      if (foundParam.count < 1) {
        if (foundParam.count === 0) {
          console.log(`Значение ${foundParam.key} не может быть меньше базового`);
        }
      } else if (accessibleStats >= increment * 3) {
        foundParam.count += increment;
        accessibleStats -= increment * 3;
      }
    }
  
    return { addParam, accessibleStats };
  };
  