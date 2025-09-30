import {
  AUTH_HEADER_PASSWORD_TITLE,
  AUTH_HEADER_TITLE,
  AUTH_HEADER_USER_PASSWORD_PLACEHOLDER,
  AUTH_HEADER_USER_TITLE,
  AUTH_HEADER_USER_TITLE_PLACEHOLDER,
  LOGIN_CTA,
} from "@/constants/auth.constants";
import { useAppDispatch } from "@/store";
import { useLoginMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/authSlice";
import { Button, Card, Form, Input, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./style.module.css";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading, isSuccess, data }] = useLoginMutation();

  const onFinish = async (values: any) => {
    try {
      await login(values).unwrap();
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials({ token: data.jwtToken, refreshToken: data.refreshToken }));
      router.push("/dashboard");
    }
  }, [isSuccess, data, dispatch, router]);

  return (
    <div className={styles.container}>
      <Card>
        <Typography.Title level={4} className={styles.title}>
          {AUTH_HEADER_TITLE}
        </Typography.Title>
        <Form layout="horizontal" onFinish={onFinish}>
          <Form.Item label={AUTH_HEADER_USER_TITLE} name="email">
            <Input placeholder={AUTH_HEADER_USER_TITLE_PLACEHOLDER} />
          </Form.Item>
          <Form.Item label={AUTH_HEADER_PASSWORD_TITLE} name="password">
            <Input.Password
              placeholder={AUTH_HEADER_USER_PASSWORD_PLACEHOLDER}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              loading={isLoading}
            >
              {LOGIN_CTA}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
