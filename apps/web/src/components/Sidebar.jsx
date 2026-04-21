import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  CarFront,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings2,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 290;

const menuGroups = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Reporting & Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'System Health', path: '/health', icon: Activity },
      { label: 'Global Search', path: '/search', icon: Search },
    ],
  },
  {
    title: 'Marketplace Operations',
    items: [
      { label: 'CRM', path: '/customers', icon: UsersRound },
      { label: 'Supplier Portal', path: '/vehicles', icon: CarFront },
      { label: 'Financial Portal', path: '/finance', icon: WalletCards },
      { label: 'Deal Lifecycle', path: '/deals', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Growth Systems',
    items: [
      { label: 'Partnerships', path: '/partners', icon: HeartHandshake },
      { label: 'Lead & Marketing', path: '/marketing', icon: Megaphone },
      { label: 'Settings', path: '/settings', icon: Settings2 },
    ],
  },
];

export default function Sidebar({ open, onClose, isDesktop }) {
  const location = useLocation();
  const navigate = useNavigate();

  function navigateTo(path) {
    navigate(path);
    if (!isDesktop) {
      onClose?.();
    }
  }

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0E2430' }}>
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Typography
          sx={{
            color: '#E7F4F8',
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
          }}
        >
          EthioAuto Nexus
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.2 }}>
          <Chip
            size="small"
            label="Financing Marketplace"
            sx={{
              bgcolor: 'rgba(47, 142, 117, 0.18)',
              color: '#D8FFF3',
              border: '1px solid rgba(95, 191, 164, 0.45)',
              fontWeight: 700,
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(169, 205, 218, 0.18)' }} />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.2, py: 1.2 }}>
        {menuGroups.map((group) => (
          <List
            key={group.title}
            dense
            subheader={(
              <ListSubheader
                disableGutters
                sx={{
                  px: 1.25,
                  py: 0.5,
                  bgcolor: 'transparent',
                  color: 'rgba(211, 236, 245, 0.72)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.09em',
                  lineHeight: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                {group.title}
              </ListSubheader>
            )}
            sx={{ mb: 1.15 }}
          >
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    mb: 0.45,
                    color: isActive ? '#03231E' : 'rgba(223, 243, 249, 0.88)',
                    bgcolor: isActive ? '#86E0C4' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? '#A4EBD4' : 'rgba(93, 145, 163, 0.28)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 34,
                      color: 'inherit',
                    }}
                  >
                    <Icon size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 800 : 600,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        ))}
      </Box>

      <Box sx={{ px: 2.2, py: 1.8, borderTop: '1px solid rgba(169, 205, 218, 0.18)' }}>
        <Typography sx={{ color: 'rgba(211, 236, 245, 0.72)', fontSize: '0.77rem' }}>
          Platform mode: Production-ready demo
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={isDesktop ? 'persistent' : 'temporary'}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          borderRight: 'none',
          boxShadow: '12px 0 30px rgba(7, 24, 31, 0.18)',
        },
      }}
    >
      {content}
    </Drawer>
  );
}
