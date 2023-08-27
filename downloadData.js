const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://schoolwijzer.amsterdam.nl';

async function fetchKinderopvangLinks() {
    const { data } = await axios.get(`${BASE_URL}/nl/opvang/kinderdagverblijf/`);
    const $ = cheerio.load(data);
    const links = $('[class^="styles_vestiging-card-title__link__"]').map((i, e) => $(e).attr('href')).get();
    return links;
}

async function fetchRisicoprofiel(link) {
    const fullUrl = `${BASE_URL}${link}`;
    const { data } = await axios.get(fullUrl);
    const $ = cheerio.load(data);

    const properties = {};
    $('[class^="styles_vestiging-eigenschap__term__"]').each((i, element) => {
        const key = $(element).text().trim();
        const value = $(element)
            .next('[class^="styles_vestiging-eigenschap__details__"]')
            .find('[class^="styles_explainer-indicator__label__"]')
            .text()
            .trim();
        properties[key] = value;
    });

    const result = {
        name: $('[class^="styles_page-title__"]').text(),
        fullUrl,
        color: $('[class^="styles_color-badge__label__"]').text(),
        description: $('[class^="styles_vestiging-risico-profiel__text__"]').text(),
        reportLink: $('a[href^="https://www.landelijkregisterkinderopvang.nl/pp/"]').first().attr('href'),
        website: $('a[class^="styles_button__"][data-testid="button"][rel="external"]').attr('href'),
        address: $('[class^="styles_vestiging-locatie__text__"] address').find('span').map((i, element) => $(element).text().trim()).get().join(' '),
        ...properties
    };

    return result;
}

async function downloadData(outputFile) {
    console.log('Starting data download');
    const kinderopvangLinks = await fetchKinderopvangLinks();

    console.log(kinderopvangLinks);

    const results = [];
    const totalLinks = kinderopvangLinks.length;

    for (let i = 0; i < totalLinks; i++) {
        console.log(`Processing link ${i + 1} out of ${totalLinks}`);
        const risicoprofiel = await fetchRisicoprofiel(kinderopvangLinks[i]);
        results.push(risicoprofiel);
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Written data in ${outputFile}`)
}

module.exports = downloadData;