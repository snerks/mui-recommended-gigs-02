import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Switch,
  Paper,
  // IconButton,
  Button,
} from "@material-ui/core";
import HighlightIcon from "@material-ui/icons/HighlightOutlined";
import HomeIcon from "@material-ui/icons/Home";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  typographyStyles: {
    flex: 1,
  },
}));

interface Props {
  isDarkMode: boolean;
  setIsDarkMode: Function;
}

const Header: React.FC<Props> = ({ isDarkMode, setIsDarkMode }) => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          Gigs of Note
        </Typography>
        <Button component={Link} to="/" size="small">
          <HomeIcon />
        </Button>
        <Button
          size="small"
          component={Link}
          to={"/editgigdetails/"}

        >
          <PlaylistAddIcon />
        </Button>

        <Paper title="use this switch for dark/light mode">
          <HighlightIcon />
        </Paper>
        <Switch
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
