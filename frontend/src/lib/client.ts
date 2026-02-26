import { createPromiseClient } from "@connectrpc/connect";
import { AuthService } from "../gen/auth/v1/auth_connect";
import { createConnectTransport } from "@connectrpc/connect-web";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

export const authClient = createPromiseClient(AuthService, transport);
