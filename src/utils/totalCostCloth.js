export function totalCostCloth(priseInfo) {
    // Создаем пустой массив для хранения объектов с суммами значений
    const sumArray = [];
  
    // Перебираем каждый объект в массиве
    priseInfo.forEach(obj => {
      if (obj && typeof obj === 'object') {
        // Перебираем ключи внутри объекта
        Object.keys(obj.priseInfo).forEach(key => {
          // Получаем текущее значение ключа
          const value = Number(obj.priseInfo[key]); // Преобразуем значение в число
  
          // Ищем объект с таким ключом в массиве sumArray
          const existingObj = sumArray.find(item => Object.keys(item).includes(key));
  
          // Если объект с таким ключом уже существует, обновляем его значение
          if (existingObj) {
            existingObj[key] += value;
          } else {
            // Иначе, создаем новый объект с текущим ключом и значением
            const newObj = { [key]: value };
            sumArray.push(newObj);
          }
        });
      }
    });
  
    // Возвращаем массив объектов с суммами значений по ключам
    return sumArray;
  }
  