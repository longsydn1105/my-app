import { createPromiseClient, Interceptor } from "@connectrpc/connect";
import { AuthService } from "../gen/auth/v1/auth_connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import Cookies from "js-cookie";

const authInterceptor: Interceptor = (next) => async (req) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");

    if (token) {
      req.header.set("Authorization", `Bearer ${token}`);
    }
  }
  return await next(req);
};
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
  interceptors: [authInterceptor],
});

export const authClient = createPromiseClient(AuthService, transport);
