"use client";

import { createContext, useContext } from "react";

const AdminSessionContext = createContext<{ csrfToken: string | null }>({ csrfToken: null });

export const AdminSessionProvider = AdminSessionContext.Provider;

export function useAdminSession() {
  return useContext(AdminSessionContext);
}
