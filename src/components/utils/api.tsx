export async function getPopularRequest() {
    const url = "https://api.themoviedb.org/3/tv/popular?api_key=e333684dcb3e9eac6a70505572519a23&language=sv-SE";
    const response = await fetch(url);
    const responseJson = await response.json();
    const seriesResults = responseJson.results;

    return seriesResults;
}

export async function getSearchRequest(query: string) {
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US&query=${query}`;
    const response = await fetch(searchUrl);
    const responseJson = await response.json();
    const searchResults = responseJson.results;

    return searchResults;
}

export async function getEpisodesRequest(id: number, season: number) {
    const urlSolo = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;
    const responseSolo = await fetch(urlSolo);
    const responseSoloJson = await responseSolo.json();
    console.log(responseSoloJson);
    console.log(responseSoloJson.episodes);
    const episodesResult = responseSoloJson.episodes;

    return episodesResult;
}

export async function getSeasonsRequest(id: number) {
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const seasonsResult = responseSoloJson.seasons;

    return seasonsResult;
}

export async function getCustomRequest(id: any, season: any) {
    const url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US&query=alla%20mot%20alla`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const episodesResult = responseSoloJson.episodes;

    return episodesResult;
}

export async function getPersonRequest(id: any) {
    const url = `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const episodesResult = responseSoloJson.cast;

    return episodesResult;
}

export async function getCreditsRequest(id: any) {
    const url = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=e333684dcb3e9eac6a70505572519a23&language=en-US`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const episodesResult = responseSoloJson;

    return episodesResult;
}

export async function getSuccessionRequest(id: any) {
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=e333684dcb3e9eac6a70505572519a23&language=sv-SE`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const episodesResult = responseSoloJson.seasons;

    return episodesResult;
}

export async function getLolRequest(id: any) {
    const url = `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=e333684dcb3e9eac6a70505572519a23&language=sv-SE`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const castList = responseSoloJson.cast;

    return castList;
}

export async function getSearchPersonRequest(id: any) {
    const url = `https://api.themoviedb.org/3/search/person?api_key=e333684dcb3e9eac6a70505572519a23&language=sv-SE&query=${id}&page=1&include_adult=false`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const personSearchList = responseSoloJson.results;

    return personSearchList;
}

export async function getEpisodeRequest(id: any, seasonNr: any, episodeNr: any) {
    const url = `
    https://api.themoviedb.org/3/tv/${id}/season/${seasonNr}/episode/${episodeNr}?api_key=e333684dcb3e9eac6a70505572519a23&language=sv-SE&query=${id}&page=1&include_adult=false`;
    const responseSolo = await fetch(url);
    const responseSoloJson = await responseSolo.json();
    const personSearchList = responseSoloJson;

    return personSearchList;
}