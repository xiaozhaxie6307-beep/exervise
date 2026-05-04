import {
  Assessment,
  AutoAwesome,
  ExpandLess,
  ExpandMore,
  Logout,
  Settings,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import ExperienceManagement from '../experience-management';
import BaseInformation from '../scale-base-information';
import SkillManagement from '../skill-management';
import UnitManagement from '../unit-management';
import UserManagement from '../user-management';

const DRAWER_WIDTH = 220;

type SubMenuEntry = {
  text: string;
  component?: JSX.Element;
};

type MenuEntry = {
  text: string;
  icon: JSX.Element;
  submenus?: SubMenuEntry[];
  auth: string[];
};

const menuItems: MenuEntry[] = [
  {
    text: '平台首页',
    icon: <AutoAwesome sx={{ fontSize: 18 }} />,
    submenus: [
      {
        text: '欢迎页',
        component: (
          <Box sx={{ p: 5, maxWidth: 640 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1a2332',
                mb: 1.5,
              }}
            >
              欢迎进入可信人工智能实验室
            </Typography>
            <Typography
              sx={{
                color: '#5a6a7a',
                lineHeight: 1.9,
                fontSize: 14,
              }}
            >
              你已成功登录。这里可以继续扩展实验室成员、
              科研成果、项目管理以及用户权限等功能。
            </Typography>
          </Box>
        ),
      },
    ],
    auth: ['USER', 'ADMIN', 'DIRECTIOR', 'DOCTOR'],
  },
  {
    text: '量表管理',
    icon: <Assessment sx={{ fontSize: 18 }} />,
    submenus: [
      { text: '量表基本信息', component: <BaseInformation /> },
    ],
    auth: ['ADMIN', 'DIRECTIOR', 'DOCTOR'],
  },
  {
    text: '基础设置',
    icon: <Settings sx={{ fontSize: 18 }} />,
    submenus: [
      { text: '用户管理',     component: <UserManagement /> },
      { text: '单位管理',     component: <UnitManagement /> },
      { text: '社会经历管理', component: <ExperienceManagement /> },
      { text: '技能管理',     component: <SkillManagement /> },
    ],
    auth: ['ADMIN', 'DIRECTIOR', 'DOCTOR'],
  },
];

const clearSession = () => {
  const keys = [
    'accessToken',
    'refreshToken',
    'role',
    'username',
    'realname',
  ];
  keys.forEach((k) => localStorage.setItem(k, ''));
};

export const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(0);
  const [activeSubIndex, setActiveSubIndex] =
    useState<number | null>(0);
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const currentUserType =
    localStorage.getItem('role') || 'USER';
  const currentUsername =
    localStorage.getItem('realname') ||
    localStorage.getItem('username') ||
    '用户';
  const avatarLetter =
    currentUsername.charAt(0).toUpperCase();

  const visibleItems = useMemo(
    () => menuItems.filter(
      (item) => item.auth.includes(currentUserType),
    ),
    [currentUserType],
  );

  const handleMenuClick = (index: number) => {
    setActiveSubIndex(0);
    setActiveIndex(
      activeIndex === index ? null : index,
    );
  };

  const handleExit = () => {
    clearSession();
    setTimeout(() => {
      window.location.href = '/login';
    }, 200);
  };

  const renderContent = () => {
    if (
      activeIndex === null ||
      activeSubIndex === null
    ) {
      return (
        <Box sx={{ p: 4, color: '#7a8a9a', fontSize: 14 }}>
          请选择左侧菜单。
        </Box>
      );
    }
    const sub =
      visibleItems[activeIndex]
        ?.submenus?.[activeSubIndex];
    return sub?.component ?? (
      <Box sx={{ p: 4, color: '#7a8a9a', fontSize: 14 }}>
        当前角色暂无可访问内容。
      </Box>
    );
  };

  const isActive = (index: number) =>
    activeIndex === index;

  const isSubActive = (
    menuIdx: number,
    subIdx: number,
  ) => activeSubIndex === subIdx &&
    activeIndex === menuIdx;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f4f6f8',
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: '#ffffff',
            borderRight: '1px solid #edf0f3',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '7px',
              background:
                'linear-gradient(135deg, #1a6b6f, #2a8f94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '3px',
                background: '#fff',
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              color: '#1a2332',
              lineHeight: 1.3,
            }}
          >
            可信 AI 实验室
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#edf0f3' }} />

        {/* Nav */}
        <List
          sx={{ px: 1.5, py: 1.5, flex: 1 }}
          disablePadding
        >
          {visibleItems.map((item, index) => (
            <Box key={index}>
              <ListItemButton
                onClick={() => handleMenuClick(index)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  color: isActive(index)
                    ? '#1a6b6f'
                    : '#5a6a7a',
                  background: isActive(index)
                    ? 'rgba(26,107,111,0.07)'
                    : 'transparent',
                  '&:hover': {
                    background: 'rgba(26,107,111,0.05)',
                    color: '#1a6b6f',
                  },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 32, color: 'inherit' }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    fontWeight: isActive(index)
                      ? 600
                      : 400,
                  }}
                />
                {item.submenus && (
                  isActive(index)
                    ? <ExpandLess
                        sx={{
                          fontSize: 16,
                          color: '#a0b0b8',
                        }}
                      />
                    : <ExpandMore
                        sx={{
                          fontSize: 16,
                          color: '#a0b0b8',
                        }}
                      />
                )}
              </ListItemButton>

              {item.submenus && (
                <Collapse
                  in={isActive(index)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding sx={{ pl: 1 }}>
                    {item.submenus.map((sub, si) => (
                      <ListItemButton
                        key={si}
                        onClick={() => setActiveSubIndex(si)}
                        sx={{
                          borderRadius: 1.5,
                          mb: 0.25,
                          px: 1.5,
                          py: 0.75,
                          color: isSubActive(index, si)
                            ? '#1a6b6f'
                            : '#7a8a9a',
                          background: isSubActive(index, si)
                            ? 'rgba(26,107,111,0.06)'
                            : 'transparent',
                          '&:hover': {
                            background:
                              'rgba(26,107,111,0.04)',
                            color: '#1a6b6f',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            mr: 1.5,
                            flexShrink: 0,
                            background: isSubActive(
                              index,
                              si,
                            )
                              ? '#1a6b6f'
                              : '#c8d4d8',
                          }}
                        />
                        <ListItemText
                          primary={sub.text}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: isSubActive(
                              index,
                              si,
                            )
                              ? 500
                              : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        <Divider sx={{ borderColor: '#edf0f3' }} />

        {/* User */}
        <Box sx={{ p: 1.5 }}>
          <Tooltip title="账号设置" placement="right">
            <Box
              onClick={(e) => setAnchorEl(
                e.currentTarget,
              )}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                cursor: 'pointer',
                '&:hover': { background: '#f4f6f8' },
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    'linear-gradient(135deg, #1a6b6f, #2a8f94)',
                }}
              >
                {avatarLetter}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1a2332',
                    lineHeight: 1.3,
                  }}
                >
                  {currentUsername}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: '#9aabb5',
                    lineHeight: 1.3,
                  }}
                >
                  {currentUserType}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              minWidth: 160,
              borderRadius: 1.5,
              boxShadow:
                '0 4px 20px rgba(0,0,0,0.10)',
              border: '1px solid #edf0f3',
            },
          }}
        >
          <MuiMenuItem
            onClick={handleExit}
            sx={{
              fontSize: 13.5,
              color: '#d94f4f',
              gap: 1.5,
              py: 1.25,
              '&:hover': {
                background: 'rgba(217,79,79,0.06)',
              },
            }}
          >
            <Logout sx={{ fontSize: 16 }} />
            退出登录
          </MuiMenuItem>
        </Menu>
      </Drawer>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            height: 52,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderBottom: '1px solid #edf0f3',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 13.5,
              fontWeight: 500,
              color: '#1a2332',
            }}
          >
            {activeIndex !== null
              ? visibleItems[activeIndex]?.text
              : '平台首页'}
            {activeIndex !== null &&
              activeSubIndex !== null &&
              visibleItems[activeIndex]
                ?.submenus?.[activeSubIndex] && (
              <Box
                component="span"
                sx={{ color: '#9aabb5', mx: 1 }}
              >
                /
              </Box>
            )}
            {activeIndex !== null &&
              activeSubIndex !== null &&
              visibleItems[activeIndex]
                ?.submenus?.[activeSubIndex]?.text}
          </Typography>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Box
            sx={{
              background: '#ffffff',
              borderRadius: 2,
              border: '1px solid #edf0f3',
              minHeight: '100%',
              overflow: 'hidden',
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
