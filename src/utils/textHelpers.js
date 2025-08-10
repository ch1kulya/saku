window.TextHelpers = {
    // Очистка описания от BB-кодов
    cleanDescription(text) {
        if (!text) return 'Описания нет';
        
        // Удаляем BB-коды
        let cleaned = text.replace(/\[(\/?\w+).*?\]/g, '');
        cleaned = cleaned.replace(/ «»/g, '');
        cleaned = cleaned.trim();
        
        // Если после очистки описание слишком короткое
        if (cleaned.length < 10) {
            return 'Описания нет';
        }
        
        // Обрезаем до 150 символов
        if (cleaned.length > 150) {
            return cleaned.substring(0, 150) + '...';
        }
        
        return cleaned;
    },
    
    // Форматирование статуса
    formatStatus(status, episodesAired, episodesTotal) {
        const statusMap = {
            'released': 'Вышло',
            'ongoing': 'Онгоинг',
            'anons': 'Анонс'
        };
        
        let baseStatus = statusMap[status] || status;
        
        if (status === 'ongoing' && episodesAired != null && episodesTotal != null) {
            baseStatus += ` ${episodesAired}/${episodesTotal} эп.`;
        } else if (status === 'released' && episodesTotal != null) {
            baseStatus += ` ${episodesTotal} эп.`;
        }
        
        return baseStatus;
    },
    
    // Экранирование специальных символов для GraphQL
    escapeQuery(str) {
        return str.replace(/\\/g, '\\\\')
                 .replace(/"/g, '\\"')
                 .replace(/\n/g, '\\n')
                 .replace(/\r/g, '\\r');
    }
};