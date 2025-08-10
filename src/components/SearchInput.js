window.SearchInput = {
    view(vnode) {
        const { value, onInput, placeholder } = vnode.attrs;
        
        return m('.search-input-wrapper', [
            m('input.search-input', {
                type: 'text',
                placeholder: placeholder || 'Введите название аниме...',
                value: value,
                oninput: onInput,
                autofocus: true
            })
        ]);
    }
};