/* tslint:disable */
/* eslint-disable */
/**
 * Oasis Nexus API V1
 * An API for accessing indexed data from the Oasis Network.  <!-- Acts as a separator after search in sidebar --> # Endpoints 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Epoch,
    EpochFromJSON,
    EpochFromJSONTyped,
    EpochToJSON,
} from './';

/**
 * A list of consensus epochs.
 * @export
 * @interface EpochListAllOf
 */
export interface EpochListAllOf {
    /**
     * 
     * @type {Array<Epoch>}
     * @memberof EpochListAllOf
     */
    epochs: Array<Epoch>;
}

export function EpochListAllOfFromJSON(json: any): EpochListAllOf {
    return EpochListAllOfFromJSONTyped(json, false);
}

export function EpochListAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): EpochListAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'epochs': ((json['epochs'] as Array<any>).map(EpochFromJSON)),
    };
}

export function EpochListAllOfToJSON(value?: EpochListAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'epochs': ((value.epochs as Array<any>).map(EpochToJSON)),
    };
}


