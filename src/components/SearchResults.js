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

        const hasResults = filteredResults.length > 0;
        const isSearching = loading || isTyping;
        
        const showLoadingIndicator = isSearching && !hasResults;
        const showNoResultsMessage = !isSearching && !hasResults && cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH;

        return m('.search-results-wrapper', {
            key: hasResults ? 'results-present' : 'results-absent'
        }, [
            m(`.loading-indicator${showLoadingIndicator ? '.is-visible' : ''}`, 'Поиск...'),
            
            m('.results' + (hasResults ? '.is-visible' : '') + (isSearching ? '.is-loading' : ''),
                filteredResults.map((anime, index) => m(window.Card, {
                    anime,
                    class: 'fade-in-stagger',
                    style: { '--animation-delay': `${index * 50}ms` }
                }))
            ),
            
            m(`.no-results${showNoResultsMessage ? '.is-visible' : ''}`, [
                m('.no-results-text', 'Ничего не найдено')
            ])
        ]);
    }
};