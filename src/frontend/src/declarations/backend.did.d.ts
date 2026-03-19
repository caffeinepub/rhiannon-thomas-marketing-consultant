/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface _SERVICE {
    getContent: ActorMethod<[], [] | [string]>;
    setContent: ActorMethod<[string], void>;
    isAdminClaimed: ActorMethod<[], boolean>;
    claimAdmin: ActorMethod<[string], boolean>;
    verifyPassword: ActorMethod<[string], boolean>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
