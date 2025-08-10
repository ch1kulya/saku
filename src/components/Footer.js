const Footer = {
    view: () =>
        m('footer', [
            m('span', 'Powered by ', m('a', { href: 'https://shikimori.one', target: '_blank' }, 'Shikimori')),
            m('span.footer-separator', '//'),
            m('span', '© 2025 ch1ka'),
            m('span.footer-separator', '//'),
            m('span', 'Source code on ', m('a', { href: 'https://github.com/ch1kulya/saku', target: '_blank' }, 'GitHub')),
        ]),
};

window.Footer = Footer;