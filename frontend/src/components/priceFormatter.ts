export default function formatPrice(price: string) {
    // Преобразуем строку в число, чтобы обрабатывать отрицательные значения
    const number = parseFloat(price);

    // Проверяем, является ли число действительным
    if (isNaN(number)) {
        return price; // Если не число, возвращаем исходную строку
    }

    // Форматируем число с пробелами между разрядами
    return number.toLocaleString('ru-RU'); // Для русской локализации
}