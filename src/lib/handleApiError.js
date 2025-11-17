import React from 'react'

export function handleApiError({ error, defaultMessage = "An unexpected error occurred." }) {
    if (!error) return defaultMessage;

    //strpi formatted error
    if (error.response?.data?.error?.message) {
        return error.response.data.error.message;
        
    }

    //strapi new error format

    if(error.error?.message){
        return error.error.message;
    }

    //axios network error
    if (error?.message) {
        return error.message;
    }
    return defaultMessage;
}
