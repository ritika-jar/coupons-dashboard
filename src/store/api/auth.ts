import { API_BASE_URL } from "@/constants/client.constants";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";
import { LoginCredentials } from "@/types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../index";
import { logout, setCredentials } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: API_ENDPOINTS.REFETCH_ACCESSTOKEN,
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };
        // store the new token
        api.dispatch(setCredentials({ token }));
        // retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: "POST",
        body: credentials,
        headers: {
          clientSecret: "7MMLJ9DHQq",
          appVer: 150,
        },
      }),
    }),
    refreshToken: builder.mutation<
      any,
      { refreshToken: string; grant_type: string }
    >({
      query: (credentials) => ({
        url: API_ENDPOINTS.REFETCH_ACCESSTOKEN,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
