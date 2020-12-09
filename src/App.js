import React, { Component } from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Refresh from "@material-ui/icons/Refresh";
import "./styles/App.css";

const CustomTooltip = withStyles({
  tooltipPlacementTop: {
    marginBottom: "8px",
  },
  tooltip: { backgroundColor: "rgba(97, 97, 97)" },
  arrow: { color: "rgba(97, 97, 97)" },
})(Tooltip);

// remove when actual data is available
const gaussianRand = () => {
  let random = 0;

  for (let i = 0; i < 25; i += 1) {
    random += Math.random();
  }

  return random / 25;
};
const generateRandomUptimes = () => {
  const emptyArray = Array.apply(null, { length: 30 });

  return emptyArray.map(() => ({
    date: new Date(),
    uptime: Math.min(101 - Math.abs((gaussianRand() - 0.5) * 10), 100),
  }));
};

const debounce = (func, wait) => {
  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;

      func(...args);
    };

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
  };
};

const fetchData = () => {
  let online, averages, apiHistory;

  fetch("health.igloo.ooo/online")
    .then((response) => {
      if (response.status !== 200) {
        // handle errors
        return;
      }

      response.json().then((data) => {
        online = data;
      });
    })
    .catch((error) => {
      // handle errors
    });

  fetch("health.igloo.ooo/averages")
    .then((response) => {
      if (response.status !== 200) {
        // handle errors
        return;
      }

      response.json().then((data) => {
        averages = { averageDay: null, averageWeek: null, averageMonth: null };
      });
    })
    .catch((error) => {
      // handle errors
    });

  fetch("health.igloo.ooo/history?service=api")
    .then((response) => {
      if (response.status !== 200) {
        // handle errors
        return;
      }

      response.json().then((data) => {
        apiHistory = data;
      });
    })
    .catch((error) => {
      // handle errors
    });

  return {
    online: generateRandomUptimes()[29].uptime === 100,
    averages: {
      averageDay: generateRandomUptimes()[29].uptime.toFixed(2),
      averageWeek: (
        generateRandomUptimes()
          .slice(-7)
          .map(({ uptime }) => uptime)
          .reduce((accumulator, value) => accumulator + value) /
        generateRandomUptimes().slice(-7).length
      ).toFixed(2),
      averageMonth: (
        generateRandomUptimes()
          .map(({ uptime }) => uptime)
          .reduce((accumulator, value) => accumulator + value) /
        generateRandomUptimes().length
      ).toFixed(2),
    },
    apiHistory: generateRandomUptimes(),
  };
};

export default class App extends Component {
  constructor(props) {
    super(props);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }

    this.state = {
      scrollTop: 0,
      ...fetchData(),
    };
  }

  updateDimensions = () => {
    const {
      greaterThan960,
      greaterThan752,
      greaterThan448,
      greaterThan352,
    } = this.state;

    if (window.innerWidth > 960) {
      !greaterThan960 && this.setState({ greaterThan960: true });
    } else {
      greaterThan960 && this.setState({ greaterThan960: false });
    }

    if (window.innerWidth > 752) {
      !greaterThan752 && this.setState({ greaterThan752: true });
    } else {
      greaterThan752 && this.setState({ greaterThan752: false });
    }

    if (window.innerWidth > 448) {
      !greaterThan448 && this.setState({ greaterThan448: true });
    } else {
      greaterThan448 && this.setState({ greaterThan448: false });
    }

    if (window.innerWidth > 352) {
      !greaterThan352 && this.setState({ greaterThan352: true });
    } else {
      greaterThan352 && this.setState({ greaterThan352: false });
    }
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", debounce(this.updateDimensions));

    setInterval(fetchData, 5_000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", debounce(this.updateDimensions));
  }

  render() {
    // remove when actual data is available
    const loading = false;
    const error = false;

    const {
      scrollTop,
      online,
      averages: { averageDay, averageWeek, averageMonth },
      apiHistory,
      greaterThan960,
      greaterThan752,
      greaterThan448,
      greaterThan352,
    } = this.state;

    const percentageStyle = {
      maxWidth: "256px",
      margin: "auto",
      textAlign: "center",
    };

    return (
      <div
        style={{
          height: "100%",
          backgroundColor: online ? "#0057cb" : "#f44336",
          overflowY: "auto",
          transition: "background-color 1s",
        }}
        className="notSelectable defaultCursor"
        onScroll={({ target: { scrollTop } }) => this.setState({ scrollTop })}
      >
        <Typography
          variant={greaterThan752 ? "h1" : greaterThan448 ? "h2" : "h3"}
          style={{
            color: "white",
            height: "256px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            opacity: Math.max(1 - scrollTop / (greaterThan752 ? 64 : 96), 0),
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {loading || error ? (
            <Skeleton
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.11)",
                maxWidth: "512px",
                width: "calc(100% - 64px)",
              }}
            />
          ) : (
            "Igloo is " + (online ? "on" : "off") + "line"
          )}
        </Typography>
        <Paper
          style={{
            width: "100%",
            minHeight: "100%",
            borderRadius:
              (1 - scrollTop / 256) * 32 +
              "px " +
              (1 - scrollTop / 256) * 32 +
              "px 0 0",
            boxShadow:
              "0px -5px 5px -3px rgba(0,0,0,0.2), 0px -8px 10px 1px rgba(0,0,0,0.14), 0px -3px 14px 2px rgba(0,0,0,0.12)",
            marginTop: "256px",
            zIndex: 20,
          }}
          elevation={8}
        >
          <div
            style={{
              maxWidth: "1080px",
              margin: "0 auto",
              padding: "0 48px",
            }}
          >
            <Grid
              container
              style={{ padding: greaterThan752 ? "96px 0" : "48px 0" }}
            >
              <Grid
                item
                xs={greaterThan752 ? 4 : 12}
                style={{ margin: "16px 0" }}
              >
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading || error ? <Skeleton /> : averageDay + "%"}
                </Typography>
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading || error ? <Skeleton /> : "Last 24 hours"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={greaterThan752 ? 4 : 12}
                style={{ margin: "16px 0" }}
              >
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading || error ? <Skeleton /> : averageWeek + "%"}
                </Typography>
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading || error ? <Skeleton /> : "Last 7 days"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={greaterThan752 ? 4 : 12}
                style={{ margin: "16px 0" }}
              >
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading || error ? <Skeleton /> : averageMonth + "%"}
                </Typography>
                <Typography
                  variant={greaterThan960 || !greaterThan752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading || error ? <Skeleton /> : "Last 30 days"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                {loading || error ? (
                  <Skeleton style={{ width: "90%", maxWidth: "192px" }} />
                ) : (
                  <Typography
                    variant={greaterThan448 ? "h5" : "h6"}
                    style={{
                      fontWeight: "bold",
                      fontSize: greaterThan352 ? "" : "1.15rem",
                    }}
                  >
                    API uptime
                  </Typography>
                )}
              </Grid>
              <Grid item xs>
                {loading || error ? (
                  <Skeleton
                    style={{
                      width: "90%",
                      maxWidth: "192px",
                      marginLeft: "auto",
                    }}
                  />
                ) : (
                  <Typography
                    variant={greaterThan448 ? "h5" : "h6"}
                    style={{
                      textAlign: "right",
                      fontWeight: 300,
                      fontSize: greaterThan352 ? "" : "1.15rem",
                    }}
                  >
                    Last 30 days
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                margin: "16px -2px 0",
                width: "calc(100% + 4px)",
                paddingBottom: "64px",
              }}
            >
              {apiHistory.map(({ date, uptime }) =>
                loading || error ? (
                  <Grid
                    item
                    style={{
                      width:
                        "calc((100% - " +
                        (greaterThan752 ? 30 : 15) * 4 +
                        "px)/" +
                        (greaterThan752 ? 30 : 15) +
                        ")",
                      height: "24px",
                      borderRadius: "4px",
                      margin: "2px",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      style={{
                        borderRadius: "4px",
                      }}
                    />
                  </Grid>
                ) : (
                  <CustomTooltip
                    title={
                      <Typography
                        variant="body1"
                        style={{ textAlign: "center" }}
                        className="notSelectable"
                      >
                        <font style={{ fontWeight: "bold" }}>
                          {moment(date).format("D MMM")}
                        </font>
                        <br />
                        {uptime.toFixed(2) + "%"}
                      </Typography>
                    }
                    enterTouchDelay={0}
                    arrow
                    placement="top"
                  >
                    <Grid
                      item
                      style={{
                        backgroundColor:
                          uptime === 100
                            ? "#00B512"
                            : uptime > 95
                            ? "#ffc804"
                            : "#f44336",
                        height: "24px",
                        width:
                          "calc((100% - " +
                          (greaterThan752 ? 30 : 15) * 4 +
                          "px)/" +
                          (greaterThan752 ? 30 : 15) +
                          ")",
                        borderRadius: "4px",
                        margin: "2px",
                      }}
                    />
                  </CustomTooltip>
                )
              )}
            </Grid>
          </div>
        </Paper>
        <Snackbar
          open={error}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          message="We couldn't load this page"
          TransitionComponent={(props) => <Slide {...props} direction="up" />}
          action={
            <IconButton style={{ color: "white" }}>
              <Refresh />
            </IconButton>
          }
        ></Snackbar>
      </div>
    );
  }
}
