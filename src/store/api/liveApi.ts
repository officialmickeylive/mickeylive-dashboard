import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const liveApi = createApi({
    reducerPath: 'liveApi',
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
    tagTypes: ['Room', 'PK'],
    endpoints: (builder) => ({
        getLiveRooms: builder.query<any, any>({
            query: (params) => ({ url: '/live/rooms', params }),
            providesTags: ['Room'],
        }),
        getPKBattles: builder.query<any, any>({
            query: (params) => ({ url: '/live/pk-battles', params }),
            providesTags: ['PK'],
        }),
        getRoomDetails: builder.query<any, string>({
            query: (id) => `/live/rooms/${id}`,
            providesTags: ['Room'],
        }),
    }),
});

export const {
    useGetLiveRoomsQuery,
    useGetPKBattlesQuery,
    useGetRoomDetailsQuery,
} = liveApi;
