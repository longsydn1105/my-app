"use client";
import { ConnectError } from "@connectrpc/connect";
import { RegisterRequest } from "@/gen/auth/v1/auth_pb";
import { authClient } from "@/lib/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  // Khoi tao react hook form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Hàm xử  lý khi bấm nút đăng ký
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setMessage(null);
      const res = await authClient.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      setMessage({
        type: "success",
        text: res.message || "Đăng ký thành công",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const connectErr = ConnectError.from(err);
      setMessage({
        type: "error",
        text: connectErr.message || "Lỗi onsubmit",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Tạo tài khoản
        </Typography>
        {message && <Alert severity={message.type} sx={{ width: "100%", mb: 2 }}></Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            fullWidth
            label="Họ và tên"
            {...register("name", { required: "Khong dc de trong ten" })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Vui long nhap email",
              pattern: { value: /^\S+@\S+$/i, message: "email sai dinh dang" },
            })}
            error={!!errors.email}
            helperText={errors.name?.message as string}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Mat Khau"
            type="password"
            {...register("password", {
              required: "Vui long nhap mat khau",
              minLength: { value: 6, message: "Pass ngắn quá, ít nhất 6 ký tự" },
            })}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Vui long nhap xac nhan mat khau",
              validate: (value: string) => {
                if (value !== getValues("password")) {
                  return "Hai mat khau khong khop!";
                }
                return true;
              },
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
            Dang ky ngay
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
