window.ShikimoriAPI = {
    async search(query) {
        const { cleanQuery, useCache } = window.FlagHandler.parseQuery(query);

        if (!cleanQuery || cleanQuery.length < window.CONFIG.MIN_SEARCH_LENGTH) {
            return [];
        }

        if (useCache) {
            const cachedResults = window.LocalStorageCache.get(cleanQuery);
            if (cachedResults) {
                return cachedResults;
            }
        }

        const escapedQuery = window.TextHelpers.escapeQuery(cleanQuery);
        const graphqlQuery = `
            query {
                animes(search: "${escapedQuery}", limit: ${window.CONFIG.RESULTS_LIMIT}, order: ranked_shiki) {
                    id
                    name
                    russian
                    score
                    status
                    episodes
                    episodesAired
                    isCensored
                    airedOn {
                        year
                    }
                    poster {
                        mainUrl
                    }
                    description
                }
            }
        `;

        try {
            const response = await fetch(window.CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: graphqlQuery })
            });

            const data = await response.json();

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return [];
            }

            const results = data.data?.animes || [];
            if (useCache) {
                window.LocalStorageCache.set(cleanQuery, results, window.CONFIG.CACHE_TTL);
            }
            return results;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }
};