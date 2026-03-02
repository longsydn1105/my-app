import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/gen/auth/v1/auth_pb";
import { authClient } from "@/lib/client";
import { PlainMessage } from "@bufbuild/protobuf";
import { ConnectError } from "@connectrpc/connect";

export const authService = {
  async login(data: PlainMessage<LoginRequest>) {
    try {
      const req = new LoginRequest(data);
      const res = await authClient.login(req);
      return { data: res as LoginResponse };
    } catch (err) {
      const connectErr = ConnectError.from(err);
      return {
        data: null,
        error: connectErr.rawMessage || "Incorrect password or account",
      };
    }
  },

  async register(data: PlainMessage<RegisterRequest>) {
    try {
      const req = new RegisterRequest(data);
      const res = await authClient.register(req);
      return { data: res as RegisterResponse, error: null };
    } catch (err) {
      const connectErr = ConnectError.from(err);
      return {
        data: null,
        error: connectErr.rawMessage || "Email already exits!",
      };
    }
  },
};
