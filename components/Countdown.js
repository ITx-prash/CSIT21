import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const divisions = [
  "days-0",
  "days-1",
  "days-text",
  "hours-0",
  "hours-1",
  "hours-text",
  "minutes-0",
  "minutes-1",
  "minutes-text",
  "seconds-0",
  "seconds-1",
  "seconds-text",
];

function CountdoenText({ text1, index, startDay }) {
  const [date, setDate] = useState();
  const [prevDate, setPrevDate] = useState();
  const [textContent, setTextContent] = useState();
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (date !== prevDate || (!text1 && textContent !== date)) {
      if (text1) {
        setTextContent(prevDate);
      } else {
        setTextContent(date);
      }
      setAnimate(true);
      setTimeout(() => {
        setTextContent(date);
        setTimeout(() => {
          setAnimate(false);
        }, 0);
      }, 750);
    }
  }, [date, prevDate, text1, textContent]);

  useEffect(() => {
    function updateCounter() {
      const now = new Date();
      const diff = startDay.getTime() - now.getTime();

      setDate((date) => {
        setPrevDate(date);
        const dates = [
          Math.floor((diff / 1000 / 60 / 60 / 24 / 10) % 10),
          Math.floor(diff / 1000 / 60 / 60 / 24) % 10,
          "d",
          Math.floor(((diff / 1000 / 60 / 60) % 24) / 10),
          (Math.floor(diff / 1000 / 60 / 60) % 24) % 10,
          "h",
          Math.floor(((diff / 1000 / 60) % 60) / 10),
          (Math.floor(diff / 1000 / 60) % 60) % 10,
          "m",
          Math.floor(((diff / 1000) % 60) / 10),
          (Math.floor(diff / 1000) % 60) % 10,
          "s left",
        ];
        return dates[index];
      });
    }
    const interval = setInterval(() => {
      updateCounter();
    }, 1000);
    updateCounter();
    return () => clearInterval(interval);
  }, [index, startDay]);

  return (
    <span
      className={`${text1 ? "text1" : "text2"} ${
        animate ? "animate" : ""
      }`}
    >
      {textContent}
    </span>
  );
}

export default function Countdown({
  text,
  yyyymmddDate,
  hideTomorrow,
}) {
  const startDay = new Date(yyyymmddDate + " GMT+05:45");
  const nowDate = new Date();
  const [hideDate, setHideDate] = useState(
    hideTomorrow ? nowDate.setDate(nowDate.getDate() + 1) : nowDate
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nowDate = new Date();
      setHideDate(
        hideTomorrow
          ? nowDate.setDate(nowDate.getDate() + 1)
          : nowDate
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [hideTomorrow]);

  if (startDay < hideDate) {
    if (!text) return null;
    if (startDay > new Date()) {
      return (
        <Typography
          variant="h5"
          component="div"
          sx={{
            textAlign: "center",
            marginBottom: ".8rem",
          }}
        >
          {text} tomorrow
        </Typography>
      );
    }
  }

  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );

  return (
    <>
      {text ? (
        <Typography
          variant="h5"
          component="div"
          sx={{
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
      ) : null}
      <Box
        className="counter"
        sx={{
          fontFamily: "Consolas, monospace, sans-serif",
          fontWeight: "bold",
          marginBottom: "-1rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {divisions.map((unit) => (
          <div
            key={unit}
            className={`counter-${unit} counter-${
              unit.endsWith("text") ? "text" : "number"
            }`}
          >
            <div className="countdown-container">
              <CountdoenText
                index={divisions.indexOf(unit)}
                text1
                startDay={startDay}
              />
              <CountdoenText
                index={divisions.indexOf(unit)}
                startDay={startDay}
              />
            </div>
            <svg className="countdown-svg" viewBox="0 0 1920 1080">
              <filter id={`${unit}-threshold`}>
                {isSafari ? null : (
                  <feColorMatrix
                    type="matrix"
                    // values="1 0 0 0 0
                    //     0 1 0 0 0
                    //     0 0 1 0 0
                    //     0 0 0 255 -100"
                    values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 255 -80"
                  />
                )}
              </filter>
            </svg>
          </div>
        ))}
      </Box>
    </>
  );
}
