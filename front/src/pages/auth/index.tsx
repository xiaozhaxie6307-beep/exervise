import { useMutation } from '@apollo/client';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@/pages/graphql/mutations';

type AuthMode = 'login' | 'register';
type AuthPageProps = { mode: AuthMode };
type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: { role: string; username: string; realname?: string };
};
type AuthResponse = { login?: AuthPayload; signup?: AuthPayload };

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return '请求失败，请稍后重试。';
};

function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    realname: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const isLogin = mode === 'login';

  const [login, { loading: loginLoading }] = useMutation<AuthResponse>(LOGIN_MUTATION);
  const [signup, { loading: signupLoading }] = useMutation<AuthResponse>(SIGNUP_MUTATION);
  const loading = loginLoading || signupLoading;

  const pageContent = useMemo(
    () =>
      isLogin
        ? {
            title: '欢迎回来',
            subtitle: '登录可信人工智能实验室管理平台',
            submitText: '登录',
            switchText: '还没有账号？立即注册',
            switchTo: '/register',
          }
        : {
            title: '创建账号',
            subtitle: '注册新的实验室平台账号',
            submitText: '注册',
            switchText: '已有账号？去登录',
            switchTo: '/login',
          },
    [isLogin],
  );

  const saveSession = (payload: AuthPayload) => {
    localStorage.setItem('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
    localStorage.setItem('role', payload.user.role);
    localStorage.setItem('username', payload.user.username);
    localStorage.setItem('realname', payload.user.realname ?? '');
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    const username = formData.username.trim().toLowerCase();
    const password = formData.password.trim();
    const realname = formData.realname.trim();

    if (!username || !password) {
      setErrorMessage('请输入用户名和密码。');
      return;
    }
    if (!isLogin) {
      if (!realname) {
        setErrorMessage('注册时请填写姓名。');
        return;
      }
      if (password !== formData.confirmPassword.trim()) {
        setErrorMessage('两次输入的密码不一致。');
        return;
      }
    }

    try {
      if (isLogin) {
        const { data } = await login({
          variables: { data: { username, password } },
        });
        if (data?.login) {
          saveSession(data.login);
          navigate('/index', { replace: true });
        }
        return;
      }
      const { data } = await signup({
        variables: {
          data: { username, password, realname },
        },
      });
      if (data?.signup) {
        saveSession(data.signup);
        navigate('/index', { replace: true });
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleMockLogin = () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('refreshToken', 'mock-refresh');
    localStorage.setItem('role', 'ADMIN');
    localStorage.setItem('username', 'admin');
    localStorage.setItem('realname', '管理员');
    navigate('/index', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f4f6f8',
      }}
    >
      {/* Left panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '45%',
          minHeight: '100vh',
          background:
            'linear-gradient(160deg, #0d3d42 0%, #1a6b6f 60%, #2a8f94 100%)',
          p: 6,
          color: '#fff',
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 8,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '3px',
                  background: '#fff',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: 0.3,
              }}
            >
              TRUSTED AI LAB
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2.5,
              letterSpacing: '-0.02em',
            }}
          >
            可信人工智能<br />实验室平台
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 360,
            }}
          >
            聚焦可信学习、模型安全、系统鲁棒性与智能治理，
            构建面向真实场景的实验室数字平台。
          </Typography>
        </Box>

        <Stack spacing={2}>
          {[
            {
              num: '01',
              label: '安全可信',
              desc: '全链路数据安全保障',
            },
            {
              num: '02',
              label: '协同科研',
              desc: '多角色权限协作管理',
            },
          ].map((item) => (
            <Box
              key={item.num}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.08)',
                border:
                  '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  minWidth: 24,
                }}
              >
                {item.num}
              </Typography>
              <Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 14 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.55)',
                    mt: 0.25,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a2332', mb: 1 }}>
            {pageContent.title}
          </Typography>
          <Typography sx={{ color: '#7a8a9a', mb: 4, fontSize: 14 }}>
            {pageContent.subtitle}
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {!isLogin && (
                <TextField
                  label="姓名"
                  value={formData.realname}
                  onChange={handleChange('realname')}
                  fullWidth
                  autoComplete="name"
                />
              )}
              <TextField
                label="用户名"
                value={formData.username}
                onChange={handleChange('username')}
                fullWidth
                autoComplete="username"
              />
              <TextField
                label="密码"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                helperText={!isLogin ? '密码不少于 8 位' : undefined}
                fullWidth
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {!isLogin && (
                <TextField
                  label="确认密码"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  fullWidth
                  autoComplete="new-password"
                />
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1, height: 44, borderRadius: 1.5,
                  fontSize: 15, fontWeight: 600,
                  background: '#1a6b6f',
                  '&:hover': { background: '#0f4a4d' },
                }}
              >
                {loading ? '处理中...' : pageContent.submitText}
              </Button>
            </Stack>
          </Box>

          <Typography
            sx={{
              mt: 3,
              textAlign: 'center',
              fontSize: 14,
              color: '#7a8a9a',
            }}
          >
            <Link
              component={RouterLink}
              to={pageContent.switchTo}
              underline="hover"
              sx={{ color: '#1a6b6f', fontWeight: 500 }}
            >
              {pageContent.switchText}
            </Link>
          </Typography>

          {isLogin && (
            <Button
              fullWidth
              variant="outlined"
              onClick={handleMockLogin}
              sx={{
                mt: 2,
                height: 40,
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 500,
                borderColor: '#dde3e8',
                color: '#7a8a9a',
                '&:hover': {
                  borderColor: '#1a6b6f',
                  color: '#1a6b6f',
                  background:
                    'rgba(26,107,111,0.04)',
                },
              }}
            >
              Mock 登录（管理员）
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AuthPage;
