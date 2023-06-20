import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import ApartmentIcon from "@mui/icons-material/Apartment";
import Table from "./Table";
import Logo from "../img/ems_company.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function NavbarSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
  };
  const theme = useTheme();

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* navbar */}
      <AppBar
        position="fixed"
        open={open}
        sx={{ boxShadow: "none", borderBottom: "1px solid rgb(220,220,220)" }}
      >
        <Toolbar sx={{ backgroundColor: "white" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
              color: "black",
            }}
          >
            <MenuIcon onClick={handleDrawerOpen} />
          </IconButton>

          <Box sx={{ marginLeft: "auto" }}>
            <IconButton>
              <Avatar alt="Remy Sharp" src="" />
            </IconButton>
            <IconButton>
              <Typography variant="h6" component="div" sx={{ color: "black" }}>
                User
              </Typography>
            </IconButton>
            <IconButton onClick={logout}>
              <LogoutIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Toolbar
            sx={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "50%", height: "50%" }}>
              <img
                src={Logo}
                alt="logo"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
            <IconButton onClick={handleDrawerClose}>
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
          </Toolbar>
        </DrawerHeader>

        <Divider />

        <Box
          sx={{
            backgroundColor: "#003B6E",
            color: "white",
            borderColor: "#E5E5E5",
            height: "100vh",
          }}
        >
          <List>
            <ListItemButton>
              <ListItemIcon>
                <ApartmentIcon sx={{ color: "#00B3FF" }} />
              </ListItemIcon>
              <ListItemText primary="Company" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* table */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Table />
      </Box>
    </Box>
  );
}
