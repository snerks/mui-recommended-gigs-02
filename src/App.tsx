import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { blue, green, amber, blueGrey, red, cyan, indigo, lightBlue, grey, teal } from "@material-ui/core/colors";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Home from "./components/Home";
import GigList from "./components/GigList";
import GigDetails from "./components/GigDetails";
import EditGigDetails from "./components/EditGigDetails";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = createMuiTheme({
    palette: {
      type: isDarkMode ? "dark" : "light",
      primary: {
        main: "#0b5994",
      },
      secondary: {
        main: "#1d83c6",
      },
    },
  });

  // const theme = createMuiTheme({
  //   palette: {
  //     type: isDarkMode ? "dark" : "light",
  //     primary: blue,
  //     secondary: blue,
  //   },
  // });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <Route
            path="/"
            exact
            render={() => (
              <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            )}
          />

          <Route
            path="/giglist/:showPastEvents/:days?"
            render={() => (
              <GigList isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            )}
          />

          <Route path="/gigdetails/:id" render={() => <GigDetails />} />
          <Route
            path="/editgigdetails/:id?"
            render={({ history, location, match }) => (
              <EditGigDetails
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                history={history}
                location={location}
                match={match} />
            )}
          />

          {/* <Route path="/" render={() => <div>404</div>} /> */}
          <Route
            path="*"
            render={() => (
              <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            )}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
