function capitalizeName(name: string) {
    return name
        .split('') // Разделяем на отдельные символы
        .map((char, index) => {
            if (index === 0 || name[index - 1] === ' ' || name[index - 1] === '-') {
                return char.toUpperCase(); // Преобразуем в верхний регистр, если это первый символ или предыдущий символ - пробел/дефис
            } else {
                return char; // Оставляем символ в том же регистре, если он не первый и не после пробела/дефиса
            }
        })
        .join(''); // Склеиваем обратно в строку
}