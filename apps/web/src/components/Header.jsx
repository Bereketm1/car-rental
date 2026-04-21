import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInitials } from '../utils/format';

const pageMap = {
  '/dashboard': { title: 'Operations Dashboard', description: 'Marketplace performance and workflow health.' },
  '/customers': { title: 'Customer Management System', description: 'Registrations, interests, loan requests, and document workflows.' },
  '/vehicles': { title: 'Vehicle Supplier Portal', description: 'Inventory, supplier onboarding, and demand routing.' },
  '/finance': { title: 'Financial Institution Portal', description: 'Loan reviews, approvals, and financing pipeline.' },
  '/deals': { title: 'Deal Management Lifecycle', description: 'Customer to vehicle purchase transaction orchestration.' },
  '/partners': { title: 'Partnership Management', description: 'Partner network, agreements, and commissions.' },
  '/marketing': { title: 'Lead Generation & Marketing', description: 'Lead capture, campaign tracking, and referrals.' },
  '/analytics': { title: 'Reporting & Analytics', description: 'Management insights for sales, approvals, revenue, and partners.' },
  '/health': { title: 'System Health Monitor', description: 'Operational checks across connected services.' },
  '/search': { title: 'Global Search', description: 'Cross-module data lookup and quick navigation.' },
  '/settings': { title: 'Platform Settings', description: 'Workspace preferences and operator profile.' },
};

export default function Header({ onToggleSidebar, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const page = pageMap[location.pathname] || {
    title: 'EthioAuto Nexus',
    description: 'Vehicle financing marketplace operations.',
  };

  function submitSearch(event) {
    if (event.key !== 'Enter') {
      return;
    }

    const query = search.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        borderBottom: '1px solid',
        borderColor: '#D8E5E8',
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '84px !important',
          px: { xs: 1.6, md: 2.6 },
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.35} alignItems="center" sx={{ minWidth: 0 }}>
          <IconButton
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            sx={{
              border: '1px solid #CFE0E5',
              bgcolor: '#FFFFFF',
            }}
          >
            <Menu size={18} />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.16rem', md: '1.36rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {page.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {page.description}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.1} alignItems="center" sx={{ flexShrink: 0 }}>
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={submitSearch}
            placeholder="Search customers, vehicles, deals..."
            sx={{ width: { xs: 190, md: 320 }, display: { xs: 'none', sm: 'block' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Notifications">
            <IconButton sx={{ border: '1px solid #CFE0E5', bgcolor: '#FFFFFF' }}>
              <Bell size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={onLogout} sx={{ border: '1px solid #CFE0E5', bgcolor: '#FFFFFF' }}>
              <LogOut size={17} />
            </IconButton>
          </Tooltip>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 0.9, borderLeft: '1px solid #D8E5E8' }}>
            <Avatar
              sx={{
                width: 37,
                height: 37,
                bgcolor: 'primary.main',
                fontWeight: 800,
                fontSize: '0.78rem',
              }}
            >
              {getInitials(user?.name || 'Marketplace Manager')}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.05 }}>
                {user?.name || 'Marketplace Manager'}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.74rem', textTransform: 'capitalize' }}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
