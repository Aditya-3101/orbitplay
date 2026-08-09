import {isAxiosError} from "axios";

export const getApiErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        return error.response?.data?.message
            ?? "Something went wrong";
    }
    return "Something went wrong";
};