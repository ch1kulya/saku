window.App = {
    // Состояние приложения
    searchQuery: '',
    results: [],
    loading: false,
    isTyping: false,
    typingTimeout: null,
    
    // Debounced поиск
    debouncedSearch: window.debounce(async function(query) {
        const { cleanQuery } = window.FlagHandler.parseQuery(query);
        if (cleanQuery.length < window.CONFIG.MIN_SEARCH_LENGTH) {
            if (!window.App.isTyping) {
                window.App.results = [];
            }
            window.App.loading = false;
            m.redraw();
            return;
        }
        
        window.App.loading = true;
        m.redraw();
        
        const results = await window.ShikimoriAPI.search(query);
        
        window.App.results = results;
        window.App.loading = false;
        m.redraw();
    }, window.CONFIG.SEARCH_DELAY),
    
    handleInput(e) {
        this.searchQuery = e.target.value;
        const { cleanQuery } = window.FlagHandler.parseQuery(this.searchQuery);
        
        clearTimeout(this.typingTimeout);
        
        if (cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH) {
            this.isTyping = true;
            this.typingTimeout = setTimeout(() => {
                this.isTyping = false;
                m.redraw();
            }, window.CONFIG.SEARCH_DELAY);
        } else {
            this.isTyping = false;
            window.App.results = [];
            m.redraw();
        }
        
        this.debouncedSearch(this.searchQuery);
    },
    
    view() {
        const { cleanQuery } = window.FlagHandler.parseQuery(this.searchQuery);
        const hasResults = this.results.length > 0;
        const hasSearched = cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH;
        
        return m('.container', [
            m(`.search-container${hasResults || hasSearched ? '.has-results' : ''}`, [
                !hasResults && !hasSearched && m(window.Logo),
                
                m(window.SearchInput, {
                    value: this.searchQuery,
                    onInput: (e) => this.handleInput(e)
                })
            ]),
            
            m(window.SearchResults, {
                results: this.results,
                loading: this.loading,
                isTyping: this.isTyping,
                searchQuery: this.searchQuery
            })
        ]);
    }
};