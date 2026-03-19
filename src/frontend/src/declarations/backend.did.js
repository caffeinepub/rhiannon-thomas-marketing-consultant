/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const idlService = IDL.Service({
    getContent: IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    setContent: IDL.Func([IDL.Text], [], []),
    isAdminClaimed: IDL.Func([], [IDL.Bool], ['query']),
    claimAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
    verifyPassword: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
    return IDL.Service({
        getContent: IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
        setContent: IDL.Func([IDL.Text], [], []),
        isAdminClaimed: IDL.Func([], [IDL.Bool], ['query']),
        claimAdmin: IDL.Func([IDL.Text], [IDL.Bool], []),
        verifyPassword: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    });
};

export const init = ({ IDL }) => { return []; };
