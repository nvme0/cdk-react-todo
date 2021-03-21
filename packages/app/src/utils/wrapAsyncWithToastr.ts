import SnackbarUtils from "./SnackbarUtils";

const wrapAsyncWithToastr = <T extends any>(
  fun: () => Promise<T>,
  options?: {
    successMessage?: string;
    onSuccess?: (result: T) => void;
    onError?: () => void;
  },
) => {
  const { successMessage, onSuccess, onError } = options || {};
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fun();
      if (successMessage) SnackbarUtils.success(successMessage);
      if (onSuccess) onSuccess(result);
      return resolve(result);
    } catch (e) {
      const message = e?.message ? e.message : "An unknown Error has occured";
      SnackbarUtils.error(message);
      if (onError) onError();
      return reject();
    }
  });
};

export default wrapAsyncWithToastr;
