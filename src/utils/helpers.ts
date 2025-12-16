// type predicate

import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

interface ErrorFormObject {
    [key: string | number] : string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
    status: 422,
    data: {
        error: ErrorFormObject
    }
}

// lên docs đọc nha log 
// https://redux-toolkit.js.org/rtk-query/usage-with-typescript

//handle ví dụ pulishDate nhỏ hơn time hiện tại
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error
}

// Serialize khi ví dụ trong update post bên service mà throw Error trong user code á.
// theo chuẩn message name stack lên doc đọc
export function isErrorWithMessage(error: unknown): error is {message: string} {
    return (
        typeof error === 'object' &&
        error != null &&
        'message' in error &&
        typeof (error as any).message === 'string'
    )
}

// thu hẹp một error có kiểu không xác định về lỗi post put không đúng field
export function isEntityError(error: unknown): error is EntityError {
    return (
        isFetchBaseQueryError(error) &&
        error.status === 422 &&
        typeof error.data === 'object' &&   
        error.data !== null &&
        !(error.data instanceof Array) 
    )
}