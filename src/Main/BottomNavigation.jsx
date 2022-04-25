import React from "react";
import {
  BottomNavigation as MuiBottomNav,
  BottomNavigationAction,
} from "@mui/material";
import { Link, useLocation, matchPath } from "react-router-dom";
import {
  Forum,
  GroupRounded,
  HomeRounded,
  Person,
  PersonRounded,
  PlusOne,
} from "@mui/icons-material";

import "./bottomnav.scss";

/**
 * Determines if the current URL matches the URL of one of the bottom navigation tabs
 * @param {string[]} patterns - the paths that are used by each of the tabs
 * @returns
 */
const useRouteMatch = (patterns) => {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
};

/**
 * Displays the navigation bar at the bottom of the screen
 * Contains links to Home, Friends, and Profile pages
 * @returns 
 */
const BottomNavigation = () => {
  // Get the current matching tab to control which tab is highlighted
  const routeMatch = useRouteMatch([
    "/",
    "/profile",
    "/conversation/:conversation_id",
    "/friends",
  ]);
  const currentTab = routeMatch?.pattern?.path;

  // Don't show bottom nav on conversation page
  return currentTab === "/conversation/:conversation_id" ? (
    <React.Fragment />
  ) : (
    <MuiBottomNav showLabels value={currentTab} className={"bottom-nav"}>
      <BottomNavigationAction
        label="Home"
        value="/"
        to="/"
        component={Link}
        icon={<HomeRounded />}
      />
      <BottomNavigationAction
        label="Friends"
        value="/friends"
        to="/friends"
        component={Link}
        icon={<GroupRounded />}
      />
      <BottomNavigationAction
        label="Profile"
        value="/profile"
        to="/profile"
        component={Link}
        icon={<PersonRounded />}
      />
    </MuiBottomNav>
  );
};

export default BottomNavigation;
