import React from "react";
import { Paper, Grid, ThemeProvider, useTheme } from "@material-ui/core";

import Header from "./Header";
// import { blue } from "@material-ui/core/colors";
import DenseTable from "./DenseTable";
import { useParams } from "react-router-dom";

interface Props {
  isDarkMode: boolean;
  setIsDarkMode: Function;

  // match?: any;
}

// interface RouterProps {
//     match: any;
// }

// type PropsWithRouterParams = Props & RouterProps;

const GigList: React.FC<Props> = ({ isDarkMode, setIsDarkMode }) => {
  // const [isDarkMode, setIsDarkMode] = useState(true);

  // const theme = createMuiTheme({
  //     palette: {
  //         type: isDarkMode ? "dark" : "light",

  //         primary: {
  //             main: '#0b5994',
  //         },
  //         secondary: {
  //             main: '#1d83c6',
  //         },
  //     },
  // });

  const { showPastEvents, days } = useParams();
  const showPastEventsParam = showPastEvents === "true";
  const daysParam = days === undefined ? -1 : +days;

  // console.log(showPastEvents, showPastEventsParam);
  // const propsAsAny = props as any;
  // const { isDarkMode, setIsDarkMode } = propsAsAny;
  // const match = propsAsAny.match;
  // const showPastEvents = match && match.params && match.params.showPastEvents;

  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} square style={{ height: "100%" }}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </Grid>
          <Grid item container justify="center">
            <DenseTable showPastEvents={showPastEventsParam} days={daysParam} />
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default GigList;
