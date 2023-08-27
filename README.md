# Schoolwijzer Scraper

This project is designed to scrape data from the Amsterdam Schoolwijzer website. It fetches details of various kinderopvang (childcare) facilities and then augments this data with distance and duration details from a specific address using the Google Maps API.


## Setup

1. Clone the repository:
```bash
    git clone https://github.com/sernaleon/AmsterdamSchoolwijzerDownloader.git
    cd AmsterdamSchoolwijzerDownloader
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file in the root directory with the following environment variables:

```
    GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
    ORIGIN_ADDRESS="Waterlooplein 2, 1011 NZ Amsterdam"
```
## Usage

### Run the scraper:

If you want to perform both downloading and augmenting in one go, run:

```bash
    npm start
```

### Download data

If you only want the data from Amsterdam Schoolwijzer but not the distance calculations:

```bash
    npm run downloadData
```

This will download the data in `./results/results.json`

### Add distances to the scraped data:

To add distance and duration details to the previously downloaded data, run:

```
    npm run add-distance
```

This will read from `./results/results.json`, augment the data, and then save the new data to `./results/results_with_distance.json`.

Ensure you have set up the Google Maps API key correctly and have sufficient quota for the Distance Matrix API.


## Sample output

```json
[
    {
        "name": "'t Lieveheersbeestje",
        "fullUrl": "https://schoolwijzer.amsterdam.nl/nl/opvang/kinderdagverblijf/vestiging/t-lieveheersbeestje/",
        "color": "geel",
        "description": "Geel betekent: geen of lichte zorg over actuele situatie, lichte zorg over nabije toekomst",
        "reportLink": "https://www.landelijkregisterkinderopvang.nl/pp/#/inzien/oko/gegevens/2ff7468c-683a-4665-95b1-082e7e77c4f3",
        "address": "Stadsdeel West De Clercqstraat 102 H 1052NM Amsterdam",
        "Type opvang": "Kinderopvang",
        "Voorschool": "Nee",
        "Capaciteit": "14 kinderen",
        "distanceBike": 6089,
        "minutesBike": 22.91,
        "distanceCar": 10709,
        "minutesCar": 17.9
    },
    {
        "name": "'t Lieveheersbeestje 2 B.V.",
        "fullUrl": "https://schoolwijzer.amsterdam.nl/nl/opvang/kinderdagverblijf/vestiging/t-lieveheersbeestje-2-b-v/",
        "color": "rood",
        "description": "Rood betekent: serieuze zorg over actuele situatie, serieuze zorg over nabije toekomst",
        "reportLink": "https://www.landelijkregisterkinderopvang.nl/pp/#/inzien/oko/gegevens/4926810c-c9a1-4ca8-8507-8d3d6fa67d4b",
        "website": "http://www.kdv-lieveheersbeestje.nl",
        "address": "Stadsdeel West Van Hogendorpplein 104 1051DA Amsterdam",
        "Type opvang": "Kinderopvang",
        "Voorschool": "Nee",
        "Capaciteit": "32 kinderen",
        "distanceBike": 4086,
        "minutesBike": 15.05,
        "distanceCar": 11293,
        "minutesCar": 18.11
    },
    //...
]

```

## Dependencies

- axios: For making HTTP requests.
- cheerio: For parsing and manipulating the HTML.
- dotenv: Reads Google Map Api Key and Origin address