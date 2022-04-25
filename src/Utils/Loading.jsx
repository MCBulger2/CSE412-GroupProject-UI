import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

/**
 * Displays a full-screen circular loading animation
 * @param {*} props 
 * @returns 
 */
const Loading = (props) => {
  const { open } = props;

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
