import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const financeApi = createApi({
    reducerPath: 'financeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Transaction', 'Ledger', 'Package'],
    endpoints: (builder) => ({
        getTransactions: builder.query<any, any>({
            query: (params) => ({ url: '/finance/transactions', params }),
            providesTags: ['Transaction'],
        }),
        getLedger: builder.query<any, void>({
            query: () => '/finance/ledger',
            providesTags: ['Ledger'],
        }),
        getCoinPackages: builder.query<any, void>({
            query: () => '/finance/packages/coins',
            providesTags: ['Package'],
        }),
        getDiamondPackages: builder.query<any, void>({
            query: () => '/finance/packages/diamonds',
            providesTags: ['Package'],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useGetLedgerQuery,
    useGetCoinPackagesQuery,
    useGetDiamondPackagesQuery,
} = financeApi;
