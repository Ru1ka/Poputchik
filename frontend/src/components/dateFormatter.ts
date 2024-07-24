export default function formatDate(dateISO: string) {
    const formattedDate : string = new Date(dateISO).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    return formattedDate
}