import {NeoDao, NeoSearchResponse} from "./NeoDao";

/**
 * Gets near earth objects data from the nasa neo feed
 * example http://api.nasa.gov/neo/rest/v1/feed?start_date=2024-09-04&end_date=2024-09-08&detailed=false&api_key=DEMO_KEY
 * @param {Date} date search date
 * @return {Promise<NeoDao[]>} an array of Near Earth Objects from the search
 */
export async function getNearEarthObjectsData(
    date: Date
): Promise<NeoDao[]> {
    const url = getNearEarthObjectsURL(date);

    console.log("fetching data from: " + url);
    const data = await fetch(url);
    console.log("Result: " + data.status);
    const neoResponse = await data.json() as NeoSearchResponse;
    return nearEarthObjects(neoResponse);
}

/**
 * generates the url for the getNearEarthObjects for date endpoint
 * @param {Date} date
 * @return {string}
 */
function getNearEarthObjectsURL(
    date: Date
): string {
    const startDate = getNearEarthObjectsStart(date);
    const endDate = getNearEarthObjectsEnd(date);
    return `http://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=false&api_key=DEMO_KEY`;
}

const twoDaysInMilliseconds = 1000 * 60 * 60 * 24 * 2;

/**
 * gets the start date in yyyy-MM-dd format 2 days prior to the provided date
 * @param {Date} date that we want to search around
 * @return {string}
 */
function getNearEarthObjectsStart(date: Date): string {
    let startTime = date.getTime();
    startTime -= twoDaysInMilliseconds;
    return dateString(new Date(startTime));
}

/**
 * gets the end date in yyyy-MM-dd format 2 days after the provided date
 * @param {Date} date that we want to search around
 * @return {string}
 */
function getNearEarthObjectsEnd(date: Date): string {
    let endTime = date.getTime();
    endTime += twoDaysInMilliseconds;
    return dateString(new Date(endTime));
}

/**
 * gets the date in yyyy-MM-dd format
 * @param {Date} date that we want to search around
 * @return {string}
 */
function dateString(date: Date): string {
    const month = date.getMonth() + 1;
    let monthStr = `${month}`;
    if (month < 10) {
        monthStr = `0${month}`;
    }

    const day = date.getDate();
    let dayStr = `${day}`;
    if (day < 10) {
        dayStr = `0${day}`;
    }
    return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

/**
 * get NeoDao array from the NeoSearchResponse
 * @param {NeoSearchResponse} neoResponse
 * @return {NeoDao[]}
 */
export function nearEarthObjects(neoResponse: NeoSearchResponse): NeoDao[] {
    const nearEarthObjects: NeoDao[] = [];
    for (const key in neoResponse.near_earth_objects) {
        if (neoResponse.near_earth_objects[key] != null) {
            nearEarthObjects.push(...neoResponse.near_earth_objects[key]);
        }
    }
    return nearEarthObjects;
}