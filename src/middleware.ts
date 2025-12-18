import {
  AnyAction,
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { isEntityError, isErrorWithMessage } from "./utils/helpers";

function isPayLoadErrorMessage(payload: unknown): payload is {
  data: {
    error: string;
  };
  status: number;
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    typeof (payload as any).data?.error === "string"
  );
}

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    console.log(action);

    // bắt lỗi code logic trong createApi
    if (isRejected(action)) {
      console.log("throw ne:");
      if (action.error.name === "CustomError") {
        toast.warn(action.error.message);
      }
    }

    // đối với những action nằm trong rtkQuery nằm trong file service blog ts
    // thì nhờ rtk nên console log ra action => meta => rejectedvalue = false
    // còn đối với những ông server 422 : 500 admin thì true nên ta bắt nó xong toast
    // không hiểu sau lúc thì nó console ra lúc thì không :vvv

    // ông rtk này có thằng bên trong là thunk nên ông này có isRejectedWithValue khá giống thunkAPI
    if (isRejectedWithValue(action)) {
      console.log(1231231);
      if (isPayLoadErrorMessage(action.payload)) {
        toast.warn(action.payload.data.error);
      } else if (isErrorWithMessage(action.payload)) {
        // Lỗi lại trừ 422 500
        console.log("454545");
        toast.warn(action.error.message);
      }
    }

    return next(action);
  };
