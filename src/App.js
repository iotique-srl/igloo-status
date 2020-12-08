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
let uptimeLog = [];

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

  return [online, (averages = {}), apiHistory];
};

export default class App extends Component {
  constructor(props) {
    super(props);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }

    const [
      online,
      { averageDay, averageWeek, averageMonth },
      apiHistory,
    ] = fetchData();

    // remove when actual data is available
    uptimeLog = generateRandomUptimes();

    this.state = {
      width: false,
      scrollTop: 0,
    };
  }

  debounce = (func, wait) => {
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

  updateDimensions = () => {
    this.setState({ width: window.outerWidth });
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.debounce(this.updateDimensions));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debounce(this.updateDimensions));
  }

  render() {
    // remove when actual data is available
    const online = uptimeLog[29].uptime === 100;
    const loading = false;
    const error = false;

    const { width, scrollTop } = this.state;

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
          variant={width > 752 ? "h1" : width > 448 ? "h2" : "h3"}
          style={{
            color: "white",
            height: "256px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            opacity: Math.max(1 - scrollTop / (width > 752 ? 64 : 96), 0),
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {loading ? (
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
              style={{ padding: width > 752 ? "96px 0" : "48px 0" }}
            >
              <Grid item xs={width > 752 ? 4 : 12} style={{ margin: "16px 0" }}>
                <Typography
                  variant={width > 960 || width < 752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading ? (
                    <Skeleton />
                  ) : (
                    uptimeLog[29].uptime.toFixed(2) + "%"
                  )}
                </Typography>
                <Typography
                  variant={width > 960 || width < 752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 24 hours"}
                </Typography>
              </Grid>
              <Grid item xs={width > 752 ? 4 : 12} style={{ margin: "16px 0" }}>
                <Typography
                  variant={width > 960 || width < 752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading ? (
                    <Skeleton />
                  ) : (
                    (
                      uptimeLog
                        .slice(-7)
                        .map(({ uptime }) => uptime)
                        .reduce((accumulator, value) => accumulator + value) /
                      uptimeLog.slice(-7).length
                    ).toFixed(2) + "%"
                  )}
                </Typography>
                <Typography
                  variant={width > 960 || width < 752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 7 days"}
                </Typography>
              </Grid>
              <Grid item xs={width > 752 ? 4 : 12} style={{ margin: "16px 0" }}>
                <Typography
                  variant={width > 960 || width < 752 ? "h2" : "h3"}
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading ? (
                    <Skeleton />
                  ) : (
                    (
                      uptimeLog
                        .map(({ uptime }) => uptime)
                        .reduce((accumulator, value) => accumulator + value) /
                      uptimeLog.length
                    ).toFixed(2) + "%"
                  )}
                </Typography>
                <Typography
                  variant={width > 960 || width < 752 ? "h5" : "h6"}
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 30 days"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                {loading ? (
                  <Skeleton style={{ width: "90%", maxWidth: "192px" }} />
                ) : (
                  <Typography
                    variant={width > 448 ? "h5" : "h6"}
                    style={{
                      fontWeight: "bold",
                      fontSize: width > 352 ? "" : "1.15rem",
                    }}
                  >
                    API uptime
                  </Typography>
                )}
              </Grid>
              <Grid item xs>
                {loading ? (
                  <Skeleton
                    style={{
                      width: "90%",
                      maxWidth: "192px",
                      marginLeft: "auto",
                    }}
                  />
                ) : (
                  <Typography
                    variant={width > 448 ? "h5" : "h6"}
                    style={{
                      textAlign: "right",
                      fontWeight: 300,
                      fontSize: width > 352 ? "" : "1.15rem",
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
              {uptimeLog.map(({ date, uptime }) =>
                loading ? (
                  <Grid
                    item
                    style={{
                      width:
                        "calc((100% - " +
                        (width > 752 ? 30 : 15) * 4 +
                        "px)/" +
                        (width > 752 ? 30 : 15) +
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
                          (width > 752 ? 30 : 15) * 4 +
                          "px)/" +
                          (width > 752 ? 30 : 15) +
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
