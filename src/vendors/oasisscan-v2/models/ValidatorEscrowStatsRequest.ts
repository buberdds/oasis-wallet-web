/* tslint:disable */
/* eslint-disable */
/**
 * 
 * This api document example is the Mainnet document, and the Testnet base URL is api.oasisscan.com/v2/testnet
 *
 * The version of the OpenAPI document: 
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ValidatorEscrowStatsRequest
 */
export interface ValidatorEscrowStatsRequest {
    /**
     * 
     * @type {string}
     * @memberof ValidatorEscrowStatsRequest
     */
    address: string;
}

export function ValidatorEscrowStatsRequestFromJSON(json: any): ValidatorEscrowStatsRequest {
    return ValidatorEscrowStatsRequestFromJSONTyped(json, false);
}

export function ValidatorEscrowStatsRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ValidatorEscrowStatsRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'address': json['address'],
    };
}

export function ValidatorEscrowStatsRequestToJSON(value?: ValidatorEscrowStatsRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'address': value.address,
    };
}


