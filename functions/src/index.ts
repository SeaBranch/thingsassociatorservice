/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {getNearEarthObjectsData} from "./getNearEarthObjectsData";

exports.getNearEarthObjects = onRequest((request, response) => {
    // Set CORS headers
    // Note: Replace "https://yourapp.domain" with the actual domain you want to allow.
    response.set("Access-Control-Allow-Origin", "*");

    // Handles preflight requests for CORS
    if (request.method === "OPTIONS") {
        // Send response to OPTIONS requests
        response.set("Access-Control-Allow-Methods", "GET, POST");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.set("Access-Control-Max-Age", "3600");
        response.status(204);
    } else {
        // Your function logic goes here
        console.log("handling GET: " + request.url);
        const dateString: string = request.query.date as unknown as string;
        const searchDateNumber = Date.parse(dateString);

        if (isNaN(searchDateNumber)) {
            console.log("invalid date in query: " + dateString);
            response
                .status(404);
        }

        const searchDate: Date = new Date(searchDateNumber);

        getNearEarthObjectsData(searchDate).then((nearEearthObjects) => {
            console
                .log(
                    `Returning ${nearEearthObjects.length} near earth objects`
                );

            response.status(200).json({
                date: dateString,
                near_earth_objects: nearEearthObjects,
            });
        });
    }
});
// export const helloWorld = onRequest(
//     {cors: ["*"]},
//     (request, response) => {
//
//         console.log(request);
//         logger.info("Hello logs!", {structuredData: true});
//         response.status(200);
//         response.json({
//             message: "Firebase!",
//         });
//     });

// export const getNearEarthObjects = onRequest((request, response) => {
//
// });
