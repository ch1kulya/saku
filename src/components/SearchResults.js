window.SearchResults = {
    view(vnode) {
        const { results, loading, searchQuery, isTyping } = vnode.attrs;
        const { cleanQuery, flags } = window.FlagHandler.parseQuery(searchQuery);

        // Показываем загрузку
        if (loading || isTyping) {
            return m('.loading', 'Поиск...');
        }

        const filteredResults = results.filter(anime => {
            if (flags.showHidden) {
                return anime.isCensored;
            }
            return !anime.isCensored;
        });
        
        // Показываем "ничего не найдено" если был поиск, но результатов нет
        if (cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH && filteredResults.length === 0) {
            return m('.no-results', [
                m('.no-results-text', 'Ничего не найдено'),
                m('.no-results-hint', `По запросу "${cleanQuery}" аниме не найдено`)
            ]);
        }
        
        // Показываем результаты
        if (filteredResults.length > 0) {
            return m('.results',
                filteredResults.map(anime => m(window.Card, { anime }))
            );
        }
        
        return null;
    }
};