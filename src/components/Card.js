window.Card = {
    handleClick(anime) {
        const url = `${window.CONFIG.SHIKIMORI_BASE_URL}/animes/${anime.id}`;
        window.open(url, '_blank');
    },
    
    view(vnode) {
        const { anime } = vnode.attrs;
        
        return m('.result-item', {
            key: anime.id,
            onclick: () => this.handleClick(anime)
        }, [
            m('img.result-poster', {
                src: anime.poster?.mainUrl || 'https://placehold.co/210x300?text=No+Image',
                alt: anime.name,
                loading: 'lazy',
                onerror: (e) => e.target.src = 'https://placehold.co/210x300?text=No+Image'
            }),
            
            m('.result-info', [
                m('.result-title', anime.russian || anime.name),
                
                m('.result-meta', [
                    anime.airedOn?.year && `${anime.airedOn.year}`,
                    anime.score > 0 && ` • ★ ${anime.score}`,
                    ` • ${window.TextHelpers.formatStatus(anime.status, anime.episodesAired, anime.episodes)}`
                ].filter(Boolean).join('')),
                
                m('.result-description', 
                    window.TextHelpers.cleanDescription(anime.description)
                )
            ])
        ]);
    }
};