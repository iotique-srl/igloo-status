import React, { Component } from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import "./styles/App.css";

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

export default class App extends Component {
  // remove when actual data is available
  constructor(props) {
    super(props);

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
    if (window.outerWidth !== this.state.width) {
      this.setState({ width: window.outerWidth });
    }
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.debounce(this.updateDimensions));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debounce(this.updateDimensions));
  }

  render() {
    const { width, scrollTop } = this.state;

    // remove when actual data is available
    const online = uptimeLog[29].uptime === 100;
    const loading = false;

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
            opacity: 1 - scrollTop / (width > 752 ? 64 : 96),
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
            minHeight: "calc(100% - 256px)",
            borderRadius:
              (1 - scrollTop / 256) * 32 +
              "px " +
              (1 - scrollTop / 256) * 32 +
              "px 0 0",
            boxShadow:
              "0px -5px 5px -3px rgba(0,0,0,0.2), 0px -8px 10px 1px rgba(0,0,0,0.14), 0px -3px 14px 2px rgba(0,0,0,0.12)",
            marginTop: "256px",
          }}
          elevation={8}
        >
          <div
            style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 48px" }}
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
                <Typography
                  variant={width > 448 ? "h5" : "h6"}
                  style={{
                    fontWeight: "bold",
                    fontSize: width > 352 ? "" : "1.15rem",
                  }}
                >
                  API uptime
                </Typography>
              </Grid>
              <Grid item xs>
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
              {uptimeLog.map(({ date, uptime }) => (
                <Tooltip
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
                </Tooltip>
              ))}
            </Grid>
          </div>
        </Paper>
      </div>
    );
  }
}
