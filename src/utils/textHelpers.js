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
    formatStatus(status) {
        const statusMap = {
            'released': 'Вышло',
            'ongoing': 'Онгоинг',
            'anons': 'Анонс'
        };
        return statusMap[status] || status;
    },

    // Плюрализация для русского языка
    pluralize(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    },

    // Форматирование эпизодов
    formatEpisodes(status, episodesAired, episodesTotal) {
        if (status === 'ongoing' && episodesAired != null && episodesTotal != null) {
            const episodesTotalText = this.pluralize(episodesTotal, 'эпизод', 'эпизода', 'эпизодов');
            return `${episodesAired}/${episodesTotal} ${episodesTotalText}`;
        }
        if (status === 'released' && episodesTotal != null) {
            const episodesTotalText = this.pluralize(episodesTotal, 'эпизод', 'эпизода', 'эпизодов');
            return `${episodesTotal} ${episodesTotalText}`;
        }
        return null;
    },
    
    // Экранирование специальных символов для GraphQL
    escapeQuery(str) {
        return str.replace(/\\/g, '\\\\')
                 .replace(/"/g, '\\"')
                 .replace(/\n/g, '\\n')
                 .replace(/\r/g, '\\r');
    }
};