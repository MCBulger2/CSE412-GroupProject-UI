import React from "react";
import { BottomNavigation as MuiBottomNav, BottomNavigationAction } from "@mui/material";
import { Link,useLocation, matchPath } from "react-router-dom";
import { Forum, GroupRounded, HomeRounded, Person, PersonRounded, PlusOne } from "@mui/icons-material";

import "./bottomnav.scss";

function useRouteMatch(patterns) {
    const { pathname } = useLocation();
  
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }
  
    return null;
  }

const BottomNavigation = () => {

    const routeMatch = useRouteMatch(["/", "/profile", "/conversation/:conversation_id", "/friends"]);
  const currentTab = routeMatch?.pattern?.path;
  console.log(routeMatch);
    return currentTab === "/conversation/:conversation_id" ? (<React.Fragment />) : (
        <MuiBottomNav showLabels value={currentTab} className={"bottom-nav"}>
          <BottomNavigationAction label="Home" value="/" to="/" component={Link} icon={<HomeRounded />} />
          <BottomNavigationAction label="Friends" value="/friends" to="/friends" component={Link} icon={<GroupRounded />} />
          <BottomNavigationAction label="Profile" value="/profile" to="/profile" component={Link} icon={<PersonRounded />} />
        </MuiBottomNav>
    );
};

export default BottomNavigation;