export interface NeoDao {
    id: string;
    neo_reference_id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter: NeoDiameter,
    is_potentially_hazardous_asteroid: boolean,
    close_approach_data: NeoCloseApproach[];
    is_sentry_object: boolean;
}

export interface NeoSearchResponse {
    links: NeoPageLinks;
    element_count: number;
    near_earth_objects: NeoDays;
}

export interface NeoDays {
    [key: string]: NeoDao[];
}

export interface NeoDiameter {
    kilometers: NeoDiameterMeasurement;
    meters: NeoDiameterMeasurement;
    miles: NeoDiameterMeasurement;
    feet: NeoDiameterMeasurement;
}

export interface NeoDiameterMeasurement {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
}

export interface NeoCloseApproach {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: NeoVelocity;
    miss_distance: NeoDistance;
    orbiting_body: string;
}

export interface NeoVelocity {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
}

export interface NeoDistance {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
}

export interface NeoPageLinks {
    next: string | null;
    previous: string | null;
    self: string | null;
}
