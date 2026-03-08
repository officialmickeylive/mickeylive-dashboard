import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const usersApi = createApi({
    reducerPath: 'usersApi',
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
    tagTypes: ['User', 'Admin', 'Agent', 'Agency', 'Host'],
    endpoints: (builder) => ({
        getUsers: builder.query<any, any>({
            query: (params) => ({ url: '/users', params }),
            providesTags: ['User'],
        }),
        getAdmins: builder.query<any, void>({
            query: () => '/admins',
            providesTags: ['Admin'],
        }),
        getAgents: builder.query<any, any>({
            query: (params) => ({ url: '/agents', params }),
            providesTags: ['Agent'],
        }),
        getAgencies: builder.query<any, any>({
            query: (params) => ({ url: '/agencies', params }),
            providesTags: ['Agency'],
        }),
        getHosts: builder.query<any, any>({
            query: (params) => ({ url: '/hosts', params }),
            providesTags: ['Host'],
        }),
        updateUserStatus: builder.mutation<any, { id: string; status: string }>({
            query: ({ id, ...body }) => ({
                url: `/users/${id}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User', 'Admin', 'Agent', 'Agency', 'Host'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetAdminsQuery,
    useGetAgentsQuery,
    useGetAgenciesQuery,
    useGetHostsQuery,
    useUpdateUserStatusMutation,
} = usersApi;
