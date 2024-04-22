import "date-fns";
import React, { useState, useEffect } from "react";

import DateFnsUtils from "@date-io/date-fns";
import {
  Formik,
  Field,
  Form,
  useField,
  FieldAttributes,
  FieldArray,
} from "formik";
import {
  TextField,
  Button,
  Checkbox,
  // Radio,
  FormControlLabel,
  Backdrop,
  CircularProgress,
  IconButton,
  Badge,
  Typography,
  Hidden,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  //   KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  // TimePicker,
  // DatePicker,
  // DateTimePicker,
  KeyboardDatePicker,
} from "formik-material-ui-pickers";
// import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";

import { Paper, Grid } from "@material-ui/core";
// import Header from "./components/Header";
import * as yup from "yup";

// import { blue } from "@material-ui/core/colors";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from "@material-ui/icons/Delete";

import { useParams, RouteComponentProps } from "react-router-dom";
import { v4 } from "uuid";

import Header from "./Header";
import { ShowsInfo, Show } from "../models/models";
// import top100Films from "../models/top100Films";
import flattenNestedArray from "../services/ArrayService";
import FormikAutocomplete, { StringOptionType } from "./FormikAutocomplete";

// type MyRadioProps = { label: string } & FieldAttributes<{}>;

// // Does not work in pre-Chromium MS Edge
// // const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
// //   const [field] = useField<{}>(props);

// //   return <FormControlLabel {...field} control={<Radio />} label={label} />;
// // };

// const MyRadio: React.FC<MyRadioProps> = (props) => {
//   const { label, ...otherProps } = props;
//   const [field] = useField<{}>(otherProps);

//   return <FormControlLabel {...field} control={<Radio />} label={label} />;
// };

type MyCheckBoxProps = { label: string } & FieldAttributes<{}>;

const MyCheckbox: React.FC<MyCheckBoxProps> = (props) => {
  const { label, ...otherProps } = props;
  const [field] = useField<{}>(otherProps);

  return <FormControlLabel {...field} control={<Checkbox />} label={label} />;
};

type MyTextFieldProps = {
  label?: string;
  placeholder: string;
} & FieldAttributes<{}>;

const MyTextField: React.FC<MyTextFieldProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      placeholder={placeholder}
      {...field}
      value={field.value || ""}
      helperText={errorText}
      autoComplete="off"
      error={!!errorText}
      fullWidth
      label={!!label ? label : null}
    />
  );
};

// type MyAutoCompleteTextFieldProps = {
//   label?: string;
//   // placeholder: string;
// } & FieldAttributes<{}> &
//   RenderInputParams;

// const MyAutoCompleteTextField: React.FC<MyAutoCompleteTextFieldProps> = ({
//   label,
//   placeholder,
//   ...props
// }) => {
//   console.log("MyAutoCompleteTextField: props", props);

//   const [field, meta] = useField<{}>(props);
//   console.log("MyAutoCompleteTextField: field", field);

//   const errorText = meta.error && meta.touched ? meta.error : "";
//   return (
//     <TextField
//       // placeholder={placeholder}
//       {...field}
//       value={field.value || ""}
//       // helperText={errorText}
//       // autoComplete="off"
//       // error={!!errorText}
//       fullWidth
//       label={!!label ? label : null}
//     />
//   );
// };
const validationSchema = yup.object({
  venue: yup.string().required(),
  date: yup.date().required(),
  artists: yup.array().of(
    yup.object({
      name: yup.string().required(),
    })
  ).required("please add at least one artist"),
});

interface Props extends RouteComponentProps<{}> {
  isDarkMode: boolean;
  setIsDarkMode: Function;
}

interface RouteParams {
  id?: string;
}

const EditGigDetails: React.FC<Props> = ({
  isDarkMode,
  setIsDarkMode,
  history,
}) => {
  const routeParams = useParams<RouteParams>();

  // const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [id] = useState(routeParams.id);

  const [showsInfo, setShowsInfo] = useState<ShowsInfo>({
    lastUpdated: new Date(),
    shows: [],
  });

  const [knownVenues, setKnownVenues] = useState<string[]>([]);
  const [knownArtists, setKnownArtists] = useState<string[]>([]);

  // const haveId = !!id;

  // const theme = createMuiTheme({
  //   palette: {
  //     type: isDarkMode ? "dark" : "light",

  //     primary: blue,
  //     secondary: blue,
  //   },
  // });

  useEffect(() => {
    const fetchShowsInfo = async () => {
      // console.log("fetchShowsInfo");

      // https://firebase.google.com/docs/firestore/use-rest-api#making_rest_calls
      // https://firebase.google.com/docs/reference/rest/database/
      const url = `https://show01-cd72d.firebaseio.com/.json?print=pretty`;

      const responseJson = await fetch(url);

      const response: ShowsInfo = await responseJson.json();

      // console.log("fetchShowsInfo", "response", response);

      const isCleanupRequired = true;

      if (isCleanupRequired) {
        const filteredResponse: ShowsInfo = {
          lastUpdated: response.lastUpdated,
          shows: [...response.shows.filter(show => show.id !== "36975dc3-5479-468b-abd2-b5407c01a695")]
        };

        setShowsInfo(filteredResponse);
        setUniqueArtistNames(filteredResponse);
        setUniqueVenueNames(filteredResponse);
        setIsLoading(false);
        return;
      }

      setShowsInfo(response);
      setUniqueArtistNames(response);
      setUniqueVenueNames(response);
      setIsLoading(false);
    };

    fetchShowsInfo();
  }, []);

  const sortStrings = (a: string, b: string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? 1 : a < b ? -1 : 0;
  };

  const setUniqueVenueNames = (showsInfo: ShowsInfo) => {
    if (!showsInfo) {
      return;
    }

    const showsVenuesNames = showsInfo.shows.map((show) => show.venue);

    const uniqueShowsVenueNames = Array.from(
      new Set(showsVenuesNames.map((item: string) => item))
    );

    uniqueShowsVenueNames.sort(sortStrings);

    setKnownVenues(uniqueShowsVenueNames);
  };

  const setUniqueArtistNames = (showsInfo: ShowsInfo) => {
    if (!showsInfo) {
      return;
    }

    const showsArtistNamesNested = showsInfo.shows.map((show) =>
      show.artists.map((artist) => artist.name)
    );

    const showsArtistNames = flattenNestedArray(showsArtistNamesNested);

    const uniqueShowsArtistNames = Array.from(
      new Set(showsArtistNames.map((item: string) => item))
    );

    uniqueShowsArtistNames.sort(sortStrings);

    setKnownArtists(uniqueShowsArtistNames);
  };

  const sortShows = (showsInfo: ShowsInfo): void => {
    showsInfo.shows.sort((lhs: Show, rhs: Show) => {
      const lhsDate = new Date(lhs.date);
      const rhsDate = new Date(rhs.date);

      // const result = lhsDate.getTime() - rhsDate.getTime();
      const lhsTime = lhsDate.getTime();
      const rhsTime = rhsDate.getTime();

      if (lhsTime === rhsTime) {
        if (lhs.id === undefined && rhs.id === undefined) {
          return 0;
        }

        if (lhs.id === undefined) {
          return -1;
        }

        if (rhs.id === undefined) {
          return 1;
        }

        return lhs.id < rhs.id ? -1 : lhs.id > rhs.id ? 1 : 0;
      } else {
        return lhsTime - rhsTime;
      }
    });
  };

  const putShowsInfo = async (showsInfo: ShowsInfo) => {
    const url = `https://show01-cd72d.firebaseio.com/.json`;

    // const responseJson = await fetch(url);

    // const response: ShowsInfo = await responseJson.json();

    const putMethod = {
      method: "PUT", // Method itself
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
      body: JSON.stringify(showsInfo), // We send data in JSON format
    };

    fetch(url, putMethod)
      .then((response) => response.json())
      .then((data) => {
        console.log("PUT Success", data);
        history.goBack();
      }) // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log("PUT error", err)); // Do something with the error
  };

  const submitShow = (show: Show) => {
    // setIsLoading(true);
    // this.errorMessage = null;

    // const showJson = this.profileFormJson;
    // const show = JSON.parse(showJson);

    console.log("submitShow", show);

    const isCleanupRequired = false;
    // 8ace1534-45fe-44e6-8889-c8175095e20c
    // 0b053262-6da0-4fd0-b3bf-e293e897ecec
    if (isCleanupRequired) {
      const cleanupShowIndex = showsInfo.shows.findIndex(
        (showCandidate) =>
          showCandidate.id === "0b053262-6da0-4fd0-b3bf-e293e897ecec"
      );

      if (cleanupShowIndex > -1) {
        showsInfo.shows[cleanupShowIndex].addedDate = new Date("2020-01-14");
      }
    }

    const isNewShow = !show.id;

    if (isNewShow) {
      show.id = v4();
      show.addedDate = new Date(new Date().toISOString().substring(0, 10));
    }

    const existingShowIndex = showsInfo.shows.findIndex(
      (showCandidate) => showCandidate.id === show.id
    );

    if (!isNewShow) {
      showsInfo.shows[existingShowIndex] = { ...show };
      showsInfo.shows[existingShowIndex].artists = [...show.artists];
    }

    const existingShow = showsInfo.shows[existingShowIndex];
    console.log("Submit Show", existingShow);

    let nextShow = isNewShow ? show : showsInfo.shows[existingShowIndex];

    if (nextShow) {
      nextShow.date = new Date(
        new Date(nextShow.date).toISOString().substring(0, 10)
      );

      if (nextShow.notes !== undefined) {
        nextShow.notes =
          nextShow.notes.trim() === "" ? undefined : nextShow.notes.trim();
      }

      if (nextShow.priceText !== undefined) {
        nextShow.priceText =
          nextShow.priceText.trim() === ""
            ? undefined
            : nextShow.priceText.trim();
      }

      nextShow.artists = nextShow.artists.map((artist) => {
        const nextArtist = { ...artist };

        if (artist.stageTime !== undefined) {
          nextArtist.stageTime =
            artist.stageTime.trim() === ""
              ? undefined
              : artist.stageTime.trim();
        }

        if (artist.videoUrl !== undefined) {
          nextArtist.videoUrl =
            artist.videoUrl.trim() === "" ? undefined : artist.videoUrl.trim();
        }

        nextArtist.id = undefined;

        return nextArtist;
      });
    }

    const nextShows = isCleanupRequired
      ? [
        ...showsInfo.shows.filter(
          (show) => show.id !== "8ace1534-45fe-44e6-8889-c8175095e20c"
        ),
      ]
      : [...showsInfo.shows];

    const nextShowsInfo = {
      ...showsInfo,
      shows: [...nextShows],
    };

    nextShowsInfo.lastUpdated = new Date(
      new Date().toISOString().substring(0, 10)
    );

    if (isNewShow && nextShow) {
      nextShowsInfo.shows.push(nextShow);

    }
    sortShows(nextShowsInfo);
    putShowsInfo(nextShowsInfo);
    // console.log("submitShow: nextShowsInfo", JSON.stringify(nextShowsInfo, null, 2));

    // history.goBack();

    // setShowsInfo(nextShowsInfo);
  };

  const getShowById = (id: string) => {
    const idMatch = showsInfo.shows.find((show) => show.id && show.id === id);

    return idMatch;
  };

  const show = !!id ? getShowById(id) : null;

  const initialValues: Show = show
    ? show
    : {
      // id: v4(),
      addedDate: new Date(),
      venue: "",
      date: new Date(),
      notes: "",
      priceText: "",
      isSoldOut: false,
      isCancelled: false,
      artists: [
        { name: "", stageTime: "", videoUrl: "", id: "" + Math.random() },
      ],
    };

  // console.log("initialValues", initialValues);

  // const theme = useTheme();

  return isLoading ? (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
      // <Container maxWidth={false}>
      // <ThemeProvider theme={theme}>
      <Paper elevation={0} square style={{ height: "100%" }}>
        <Grid container direction="column">
          <Grid item>
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </Grid>
          <Grid item container alignContent="stretch">
            <Grid item xs={12}>
              <div style={{ margin: 15 }}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);

                    // Make async call
                    console.log("submit", data);
                    submitShow(data);

                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  }) => (
                      <Grid container>
                        <Grid item xs={12}>
                          <Form>
                            <Grid container spacing={2} direction="column">
                              {/* <Grid item>
                                {JSON.stringify(values.date)}
                              </Grid> */}
                              <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Field
                                    component={KeyboardDatePicker}
                                    autoOk
                                    name="date"
                                    label={`Event Date ${new Date(values.date).getUTCDate() <= new Date().getUTCDate() ? " : (FYI: Date is not in the future!!!)" : ""}`}
                                    disableToolbar
                                    variant="inline"
                                    format="dd MMMM yyyy"
                                    fullWidth
                                  />
                                </MuiPickersUtilsProvider>
                              </Grid>
                              <Grid item>
                                <Field
                                  name="venue"
                                  component={FormikAutocomplete}
                                  label="Venue"
                                  options={
                                    knownVenues.map((venue) => {
                                      return {
                                        text: venue,
                                      };
                                    }) as StringOptionType[]
                                  }
                                  textFieldProps={{ fullWidth: true }}
                                  freeSolo
                                  selectOnFocus
                                  autoSelect
                                />
                                {/* <MyTextField
                              placeholder="venue"
                              name="venue"
                              type="input"
                              label="Venue"
                            />
                            <Autocomplete
                              freeSolo
                              options={knownVenues.map((option) => option)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="venue"
                                  value={values.venue || ""}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              )}
                            /> */}
                              </Grid>
                            </Grid>

                            <Grid
                              container
                              direction="column"
                              style={{ marginTop: 10 }}
                            >
                              <Grid item container>
                                <Grid item xs={12}>
                                  <FieldArray name="artists">
                                    {(arrayHelpers) => (
                                      <div>
                                        <Grid container direction="column">
                                          <Grid
                                            item
                                            container
                                            justify="flex-start"
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            <Grid item>
                                              <Badge
                                                badgeContent={values.artists.length}
                                                color="primary"
                                                showZero
                                              >
                                                <Typography>Artists</Typography>
                                              </Badge>
                                            </Grid>
                                            <Grid item>
                                              <IconButton
                                                aria-label="add"
                                                onClick={() =>
                                                  arrayHelpers.push({
                                                    name: "",
                                                    stageTime: "",
                                                    videoUrl: "",
                                                    id: "" + Math.random(),
                                                  })
                                                }
                                              >
                                                <PersonAddIcon />
                                              </IconButton>
                                            </Grid>
                                            <Grid item>
                                              {
                                                errors && errors.artists && (typeof errors.artists === "string") &&
                                                <p style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.artists}</p>
                                              }
                                              {/* <span style={{ color: "red" }}>{errors.artists}</span> */}
                                            </Grid>
                                          </Grid>
                                          <div
                                          // item
                                          // container
                                          // xs={12}
                                          // style={{
                                          //   border: "5px solid black",
                                          //   padding: 30,
                                          // }}
                                          >
                                            {values.artists.map((artist, index) => {
                                              const nameName = `artists.${index}.name`;
                                              const stageTimeName = `artists.${index}.stageTime`;
                                              // const videoUrlName = `artists.${index}.videoUrl`;

                                              return (
                                                <Grid
                                                  item
                                                  container
                                                  xs={12}
                                                  key={artist.id || Math.random()}
                                                  spacing={2}
                                                >
                                                  <Grid item xs={9} sm={6}>
                                                    {/* <MyTextField
                                                  placeholder="artist name"
                                                  name={nameName}
                                                /> */}
                                                    <Field
                                                      name={nameName}
                                                      component={FormikAutocomplete}
                                                      label="Name"
                                                      options={
                                                        knownArtists.map(
                                                          (artistName) => {
                                                            return {
                                                              text: artistName,
                                                            };
                                                          }
                                                        ) as StringOptionType[]
                                                      }
                                                      selectOnFocus
                                                      freeSolo
                                                      textFieldProps={{
                                                        fullWidth: true,
                                                      }}
                                                    />
                                                  </Grid>

                                                  <Hidden smDown>
                                                    <Grid item xs={3}>
                                                      <MyTextField
                                                        placeholder="stage time"
                                                        name={stageTimeName}
                                                      />
                                                    </Grid>
                                                  </Hidden>
                                                  {/* <Hidden smDown>
                                                    <Grid item xs={3}>
                                                      <MyTextField
                                                        placeholder="video url"
                                                        name={videoUrlName}
                                                      />
                                                    </Grid>
                                                  </Hidden> */}

                                                  <Grid item xs={3}>
                                                    <IconButton
                                                      size="small"
                                                      aria-label="delete"
                                                      onClick={() =>
                                                        arrayHelpers.remove(index)
                                                      }
                                                    >
                                                      <DeleteIcon />
                                                    </IconButton>
                                                  </Grid>
                                                </Grid>
                                              );
                                            })}
                                          </div>
                                        </Grid>
                                      </div>
                                    )}
                                  </FieldArray>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid
                              container
                              spacing={2}
                              direction="column"
                              style={{ marginTop: 15 }}
                            >
                              <Grid item>
                                <MyTextField
                                  placeholder="notes"
                                  name="notes"
                                  type="input"
                                  label="Notes"
                                />
                              </Grid>
                              <Grid item>
                                <MyTextField
                                  placeholder="price"
                                  name="priceText"
                                  type="input"
                                  label="Price"
                                />
                              </Grid>
                            </Grid>

                            <MyCheckbox
                              name="isSoldOut"
                              type="checkbox"
                              label="Sold Out?"
                            />

                            <MyCheckbox
                              name="isCancelled"
                              type="checkbox"
                              label="Cancelled?"
                            />

                            <Grid
                              item
                              container
                              justify="flex-end"
                              style={{ paddingTop: 5 }}
                            >
                              <Button
                                disabled={isSubmitting}
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="small"
                              >
                                save
                          </Button>
                            </Grid>
                          </Form>
                        </Grid>
                        <Grid item xs={12} container direction="column">
                          {/* <Grid item>
                            <pre>{JSON.stringify(values, null, 2)}</pre>
                          </Grid>
                          <Grid item>
                            <pre>{JSON.stringify(errors, null, 2)}</pre>
                          </Grid> */}
                          {/* <Grid item>
                        <pre>{JSON.stringify(knownVenues, null, 2)}</pre>
                      </Grid>
                      <Grid item>
                        <pre>{JSON.stringify(knownArtists, null, 2)}</pre>
                      </Grid> */}
                        </Grid>
                      </Grid>
                    )}
                </Formik>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      // </ThemeProvider>
      // </Container>
    );
};

export default EditGigDetails;
