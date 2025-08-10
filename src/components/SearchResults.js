window.SearchResults = {
    view(vnode) {
        const { results, loading, searchQuery, isTyping } = vnode.attrs;
        const { cleanQuery, flags } = window.FlagHandler.parseQuery(searchQuery);

        const filteredResults = results.filter(anime => {
            if (flags.showHidden) {
                return anime.isCensored;
            }
            return !anime.isCensored;
        });

        // Показываем результаты, если они есть
        if (filteredResults.length > 0) {
            return m(
                '.results',
                {
                    class: (loading || isTyping) ? 'is-loading' : ''
                },
                filteredResults.map(anime => m(window.Card, { anime }))
            );
        }
        
        // Показываем загрузку, если результатов пока нет, но идет поиск
        if (loading || isTyping) {
            return m('.loading', 'Поиск...');
        }

        // Показываем "ничего не найдено" если был поиск, но результатов нет
        if (cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH && filteredResults.length === 0) {
            return m('.no-results', [
                m('.no-results-text', 'Ничего не найдено')
            ]);
        }
        
        return null;
    }
};