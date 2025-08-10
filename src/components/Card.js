window.Card = {
    handleClick(anime) {
        const url = `${window.CONFIG.SHIKIMORI_BASE_URL}/animes/${anime.id}`;
        window.open(url, '_blank');
    },
    
    view(vnode) {
        const { anime } = vnode.attrs;
        const episodes = window.TextHelpers.formatEpisodes(anime.status, anime.episodesAired, anime.episodes);
        const scoreStyle = {};

        if (anime.score > 0) {
            const opacity = Math.max(0.05, Math.min(0.5, (anime.score - 5) / 5 * 0.4 + 0.15));
            scoreStyle.textShadow = `0 0 8px rgba(255, 215, 0, ${opacity})`;
        }
        
        const metaParts = [];
        if (anime.airedOn?.year) {
            metaParts.push(m('span', `${anime.airedOn.year}`));
        }
        if (anime.score > 0) {
            metaParts.push(m('span.meta-score', { style: scoreStyle }, `★ ${anime.score}`));
        }
        metaParts.push(m('span.meta-status', { className: `status-${anime.status}` }, window.TextHelpers.formatStatus(anime.status)));
        if (episodes) {
            metaParts.push(m('span', episodes));
        }
        
        const metaContent = metaParts.reduce((acc, part, index) => {
            if (index > 0) {
                acc.push(m('span.meta-separator', '/'));
            }
            acc.push(part);
            return acc;
        }, []);

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

                m('.result-meta', metaContent),

                m('.result-description',
                    window.TextHelpers.cleanDescription(anime.description)
                )
            ])
        ]);
    }
};