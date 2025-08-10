window.FlagHandler = {
  flagAliases: {
    showHidden: ['!h', '!hentai'],
    noCache: ['!nocache']
  },

  parseQuery(query) {
    let useCache = true;
    const flags = {};
    const flagRegex = /!\w+/g;
    const foundFlags = query.match(flagRegex) || [];

    for (const key in this.flagAliases) {
      if (this.flagAliases[key].some(alias => foundFlags.includes(alias))) {
        flags[key] = true;
      }
    }

    if (flags.noCache) {
      useCache = false;
    }

    const cleanQuery = query.replace(flagRegex, '').trim();

    return { cleanQuery, flags, useCache };
  }
};