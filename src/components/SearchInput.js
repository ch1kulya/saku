window.SearchInput = {
    view(vnode) {
        const { value, onInput, placeholder, setTooltip, showIcon } = vnode.attrs;
        
        return m('.search-input-wrapper', [
            m('input.search-input', {
                type: 'text',
                placeholder: placeholder || 'Введите название аниме...',
                value: value,
                oninput: onInput,
                autofocus: true
            }),
            showIcon && m('span.tooltip-trigger-icon', {
                onmouseenter: () => setTooltip(true),
                onmouseleave: () => setTooltip(false)
            }, '?')
        ]);
    }
};