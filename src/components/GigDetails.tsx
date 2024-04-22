import React, { useState, useEffect } from "react";
import {
  useTheme,
  Grid,
  Chip,
  Backdrop,
  CircularProgress,
  IconButton,
  // Container,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";

import { useParams, Link } from "react-router-dom";
import { ShowsInfo } from "../models/models";

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
    title: {
      fontSize: 14,
    },
  });
});

interface RouteParams {
  id: string;
}

const GigDetails: React.FC = () => {
  const routeParams = useParams<RouteParams>();

  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;

  const theme = useTheme();
  // const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [id] = useState(routeParams.id);

  const [showsInfo, setShowsInfo] = useState<ShowsInfo>({
    lastUpdated: new Date(),
    shows: [],
  });

  useEffect(() => {
    const fetchShowsInfo = async () => {
      // console.log("fetchShowsInfo");

      // https://firebase.google.com/docs/firestore/use-rest-api#making_rest_calls
      // https://firebase.google.com/docs/reference/rest/database/
      const url = `https://show01-cd72d.firebaseio.com/.json`;

      const responseJson = await fetch(url);

      const response: ShowsInfo = await responseJson.json();

      // console.log("fetchShowsInfo", "response", response);

      setShowsInfo(response);
      setIsLoading(false);
    };

    fetchShowsInfo();
  }, []);

  const getShowById = (id: string) => {
    const idMatch = showsInfo.shows.find((show) => show.id && show.id === id);

    return idMatch;
  };

  const show = getShowById(id);

  const getDayName = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", { weekday: "short" });
  };

  const getDateFormatted = (date: Date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };

    return new Date(date).toLocaleDateString("en-GB", options);
  };

  return isLoading ? (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
      // <Container maxWidth={false}>
      <Typography
        component="div"
        className={classes.root}
        style={{ height: "100vh" }}
      >
        <Grid
          container
          direction="column"
          alignItems="stretch"
          alignContent="stretch"
          style={{ height: "100%" }}
        >
          <Grid item xs={12}>
            {!show && <h1>Event not found</h1>}

            {show && (
              <Card className={classes.root} variant="outlined" square>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {getDayName(show.date)}, {getDateFormatted(show.date)}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {show.artists[0].name}
                    <IconButton
                      aria-label="edit"
                      component={Link}
                      to={`/editgigdetails/${show.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </Typography>
                  <Typography color="textSecondary">{show.venue}</Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    style={{ marginTop: 15 }}
                  >
                    <Typography color="textSecondary">Artists</Typography>
                    <Grid container direction="column" spacing={1}>
                      {show.artists.map((artist) => {
                        return (
                          <Grid item container key={`${show.id}.${artist.name}`}>
                            <Grid item xs={4}>
                              {artist.name}
                            </Grid>

                            <Grid item xs={4}>
                              {artist.stageTime && (
                                <Chip
                                  style={{
                                    backgroundColor: theme.palette.info.main,
                                    color: theme.palette.info.contrastText,
                                  }}
                                  size="small"
                                  label={artist.stageTime}
                                />
                              )}
                            </Grid>

                            <Grid item xs={4}>
                              {artist.videoUrl && (
                                <a href={artist.videoUrl}>
                                  <Chip
                                    style={{
                                      backgroundColor: theme.palette.info.main,
                                      color: theme.palette.info.contrastText,
                                    }}
                                    size="small"
                                    label="Video"
                                  />
                                </a>
                              )}
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Grid
                      container
                      direction="column"
                      spacing={1}
                      style={{ marginTop: 10 }}
                    >
                      {show.isSoldOut && (
                        <Grid item>
                          <Chip
                            style={{
                              backgroundColor: theme.palette.warning.main,
                              color: theme.palette.warning.contrastText,
                            }}
                            size="small"
                            label="Sold Out"
                          />
                        </Grid>
                      )}
                      {show.isCancelled && (
                        <Grid item>
                          <Chip
                            style={{
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.error.contrastText,
                            }}
                            size="small"
                            label="Cancelled"
                          />
                        </Grid>
                      )}
                      {show.priceText && show.priceText.indexOf("£") === 0 && (
                        <Grid item>
                          <Chip
                            style={{
                              backgroundColor: theme.palette.info.main,
                              color: theme.palette.info.contrastText,
                            }}
                            size="small"
                            label={show.priceText}
                          />
                        </Grid>
                      )}
                      {show.notes && (
                        <Grid item>
                          <span
                            style={
                              {
                                // backgroundColor: theme.palette.info.main,
                                // color: theme.palette.info.contrastText
                              }
                            }
                          >
                            {show.notes}
                          </span>
                        </Grid>
                      )}
                    </Grid>
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* <Button size="small">Learn More</Button> */}
                  <Typography variant="body2" component="div">
                    <Grid
                      container
                      direction="column"
                      style={{ marginLeft: 10, marginRight: 10 }}
                    >
                      {show.addedDate && (
                        <Grid item>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            Added: {getDayName(show.addedDate)},{" "}
                            {getDateFormatted(show.addedDate)}
                          </Typography>
                        </Grid>
                      )}
                      {show.id && (
                        <Grid item>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            Id: {show.id}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Typography>
                </CardActions>
              </Card>
            )}

            {/* <pre>{JSON.stringify(getShowById(id), null, 2)}</pre> */}
          </Grid>
        </Grid>
      </Typography>
      // </Container>
    );
};

export default GigDetails;
