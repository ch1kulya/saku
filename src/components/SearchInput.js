window.SearchInput = {
    view(vnode) {
        const { value, onInput, placeholder } = vnode.attrs;
        
        return m('input.search-input', {
            type: 'text',
            placeholder: placeholder || 'Введите название аниме...',
            value: value,
            oninput: onInput,
            autofocus: true
        });
    }
};