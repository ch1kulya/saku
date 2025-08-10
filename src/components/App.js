window.App = {
    // Состояние приложения
    searchQuery: '',
    results: [],
    loading: false,
    isTyping: false,
    typingTimeout: null,
    
    // Состояние тултипа
    showTooltip: false,
    tooltipHover: false,
    tooltipTimeout: null,
    
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

    // Логика управления тултипом
    setTooltip(state) {
        clearTimeout(this.tooltipTimeout);
        if (state) {
            // Показываем тултип после задержки
            this.tooltipTimeout = setTimeout(() => {
                this.showTooltip = true;
                m.redraw();
            }, 100);
        } else {
            // Скрываем тултип после задержки (чтобы успеть навести на него)
            this.tooltipTimeout = setTimeout(() => {
                if (!this.tooltipHover) {
                    this.showTooltip = false;
                    m.redraw();
                }
            }, 200);
        }
    },

    setTooltipHover(state) {
        this.tooltipHover = state;
        if (!state) {
            // Если курсор ушел с тултипа, запускаем логику скрытия
            this.setTooltip(false);
        }
    },

    view() {
        const { cleanQuery } = window.FlagHandler.parseQuery(this.searchQuery);
        const hasResults = this.results.length > 0;
        const hasSearched = cleanQuery.length >= window.CONFIG.MIN_SEARCH_LENGTH;
        const showTooltipArea = !hasResults && !hasSearched;

        return m('.container', [
            m(`.search-container${hasResults || hasSearched ? '.has-results' : ''}`, [
                m('.header-content', [
                    m(window.Logo),
                    m(window.SearchInput, {
                        value: this.searchQuery,
                        onInput: (e) => this.handleInput(e),
                        // Передаем колбэки и состояние видимости
                        setTooltip: this.setTooltip.bind(this),
                        showIcon: showTooltipArea
                    }),
                    // Рендерим тултип только когда он нужен, чтобы не занимать место
                    showTooltipArea && m(window.Tooltip, {
                        visible: this.showTooltip || this.tooltipHover,
                        setTooltipHover: this.setTooltipHover.bind(this)
                    })
                ])
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