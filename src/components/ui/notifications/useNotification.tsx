import { useSnackbar, VariantType, SnackbarKey } from "notistack";
import { useCallback } from "react";

export function useNotification() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  type NotifyVariant = VariantType | undefined;

  const baseContent = (message: string) => (
    <div className="flex flex-col items-center justify-center gap-3 px-7 py-4 rounded-2xl shadow-[0_2px_16px_0_rgba(124,58,237,0.10)] min-w-[260px] max-w-[90vw] bg-[#7c3aed]">
      <span className="text-white text-lg font-semibold text-center w-full leading-snug tracking-tight break-words">
        {message}
      </span>
    </div>
  );

  const notify = useCallback(
    (message: string, variant: NotifyVariant = "default") => {
      enqueueSnackbar("", {
        variant,
        content: () => baseContent(message),
      });
    },
    [enqueueSnackbar]
  );

  const success = useCallback(
    (message: string) => {
      enqueueSnackbar("", {
        variant: "success",
        content: () => baseContent(message),
      });
    },
    [enqueueSnackbar]
  );

  const error = useCallback(
    (message: string) => {
      enqueueSnackbar("", {
        variant: "error",
        content: () => baseContent(message),
      });
    },
    [enqueueSnackbar]
  );

  const info = useCallback(
    (message: string) => {
      enqueueSnackbar("", {
        variant: "info",
        content: () => baseContent(message),
      });
    },
    [enqueueSnackbar]
  );

  const warning = useCallback(
    (message: string) => {
      enqueueSnackbar("", {
        variant: "warning",
        content: () => baseContent(message),
      });
    },
    [enqueueSnackbar]
  );

  const confirm = useCallback(
    (message: string, onConfirm: () => void) => {
      const content = (key: SnackbarKey) => (
        <div className="flex flex-col items-center justify-center gap-3 px-7 py-4 rounded-2xl shadow-[0_2px_16px_0_rgba(124,58,237,0.10)] min-w-[260px] max-w-[90vw] bg-[#7c3aed]">
          <span className="text-white text-lg font-semibold text-center w-full leading-snug tracking-tight break-words">
            {message}
          </span>
          <div className="flex gap-2 w-full justify-center">
            <button
              onClick={() => {
                onConfirm();
                closeSnackbar(key);
              }}
              className="px-4 py-1 rounded text-white text-sm font-medium border border-white"
              style={{ background: "#955cf6" }}
            >
              Sí
            </button>
            <button
              onClick={() => closeSnackbar(key)}
              className="px-4 py-1 rounded text-[#2f1065] text-sm font-medium border border-[#2f1065]"
              style={{ background: "#f1e9fe" }}
            >
              No
            </button>
          </div>
        </div>
      );
      enqueueSnackbar("", {
        variant: "info",
        autoHideDuration: null,
        content,
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );

  return { notify, success, error, info, warning, confirm };
}
