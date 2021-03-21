import React from "react";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";
import { Box, Typography } from "@material-ui/core";

export interface Props extends CircularProgressProps {
  message?: string;
}

const CircularProgressCentered = ({ message, ...props }: Props) => {
  return (
    <Box position="relative" width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      <CircularProgress {...props} />
      {message && (
        <Typography variant="subtitle1" color="textSecondary" style={{ marginLeft: "16px" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CircularProgressCentered;
