window.ShikimoriAPI = {
    async search(query) {
        const { cleanQuery, useCache, flags } = window.FlagHandler.parseQuery(query);

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
                animes(search: "${escapedQuery}", limit: 24) {
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

            let relevantResults = results;
            if (!flags.noRelevance) {
                const lowerCaseQuery = cleanQuery.toLowerCase();
                relevantResults = results.filter(anime => {
                    const title = anime.russian?.toLowerCase() || anime.name?.toLowerCase() || '';
                    const similarity = window.JaroWinkler.similarity(lowerCaseQuery, title);
                    return similarity > 0.8;
                });
            }

            const sortedResults = [...relevantResults].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            const topResults = sortedResults.slice(0, 6);

            if (useCache) {
                window.LocalStorageCache.set(query, topResults, window.CONFIG.CACHE_TTL);
            }
            return topResults;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }
};