/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";
import {NeoDao, NeoSearchResponse} from "./NeoDao";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    console.log(request);
    logger.info("Hello logs!", {structuredData: true});
    response.status(200);
    response.json({
        message: "Firebase!",
    });
});

export const getNearEarthObjects = onRequest((request, response) => {
    console.log(request);
    const dateString: string = request.query.date as unknown as string;
    const searchDateNumber = Date.parse(dateString);
    const searchDate: Date = new Date(searchDateNumber);

    getNearEarthObjectsData(searchDate).then((data) => {
        console.log(data);
        response.status(200).json({
            date: dateString,
            near_earth_objects: data,
        });
    });
});

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

    console.log("fetching: " + url);
    const data = await fetch(url);
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
function getNearEarthObjectsStart(date: Date) {
    let startTime = date.getTime();
    startTime -= twoDaysInMilliseconds;
    return dateString(new Date(startTime));
}

/**
 * gets the end date in yyyy-MM-dd format 2 days after the provided date
 * @param {Date} date that we want to search around
 * @return {string}
 */
function getNearEarthObjectsEnd(date: Date) {
    let endTime = date.getTime();
    endTime += twoDaysInMilliseconds;
    return dateString(new Date(endTime));
}

/**
 * gets the date in yyyy-MM-dd format
 * @param {Date} date that we want to search around
 * @return {string}
 */
function dateString(date: Date) {
    const month = date.getMonth();
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
function nearEarthObjects(neoResponse: NeoSearchResponse) {
    const nearEarthObjects: NeoDao[] = [];
    for (const key in neoResponse.near_earth_objects) {
        if (neoResponse.near_earth_objects[key] != null) {
            nearEarthObjects.push(...neoResponse.near_earth_objects[key]);
        }
    }
    return nearEarthObjects;
}
