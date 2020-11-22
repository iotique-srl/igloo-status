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
  }

  render() {
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
        }}
        className="notSelectable defaultCursor"
      >
        <Typography
          variant="h1"
          style={{
            color: "white",
            height: "256px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            height: "calc(100% - 256px)",
            borderRadius: "32px 32px 0 0",
            boxShadow:
              "0px -5px 5px -3px rgba(0,0,0,0.2), 0px -8px 10px 1px rgba(0,0,0,0.14), 0px -3px 14px 2px rgba(0,0,0,0.12)",
          }}
          elevation={8}
        >
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <Grid container style={{ padding: "96px 0" }}>
              <Grid item xs>
                <Typography
                  variant="h2"
                  style={{ ...percentageStyle, fontWeight: "bold" }}
                >
                  {loading ? (
                    <Skeleton />
                  ) : (
                    uptimeLog[29].uptime.toFixed(2) + "%"
                  )}
                </Typography>
                <Typography
                  variant="h5"
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 24 hours"}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="h2"
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
                  variant="h5"
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 7 days"}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="h2"
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
                  variant="h5"
                  style={{ ...percentageStyle, fontWeight: 300 }}
                >
                  {loading ? <Skeleton /> : "Last 30 days"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  API uptime
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="h5"
                  style={{ textAlign: "right", fontWeight: 300 }}
                >
                  Last 30 days
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                margin: "16px -2px 64px -2px",
                width: "calc(100% + 4px)",
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
                      width: "calc(calc(100% - 120px)/30)",
                      borderRadius: "4px",
                      margin: "0 2px",
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
