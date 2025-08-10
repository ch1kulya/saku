window.Tooltip = {
    view: function(vnode) {
        const { visible, setTooltipHover } = vnode.attrs;
        const flags = [
            { flag: '!h, !hentai', description: 'показывать 18+ контент' },
            { flag: '!nocache', description: 'не использовать кеш для запроса' },
            { flag: '!nr, !norelevance', description: 'отключить сортировку по релевантности' }
        ];

        return m(`.tooltip-content${visible ? '.is-visible' : ''}`, {
            onmouseenter: () => setTooltipHover(true),
            onmouseleave: () => setTooltipHover(false)
        }, [
            m('h4', 'Доступные флаги'),
            m('ul', flags.map(item =>
                m('li', [
                    m('code', item.flag),
                    m('span', ` – ${item.description}`)
                ])
            ))
        ]);
    }
};