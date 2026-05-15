import { ComponentType } from "react";

export function lazyRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): Promise<{ default: T }> {
  return new Promise((resolve, reject) => {
    componentImport()
      .then(resolve)
      .catch((error: Error) => {
        if (
          error.message.includes(
            "Failed to fetch dynamically imported module"
          )
        ) {
          window.location.reload();
        }

        reject(error);
      });
  });
}