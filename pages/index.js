import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FrontPageGenerator from "../components/FrontPageGenerator";
import { Box, Container, Toolbar } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Materials from "../components/Materials";
import Soon from "../components/Soon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import OpCodeFinder from "../components/OpCodeFinder";
import TallyBar from "../components/TallyBar";
import ClassRoutine from "../components/ClassRoutine";
import ExamRoutine from "../components/ExamRoutine";
import CheckForUpdate from "../components/CheckForUpdate";
import { examTypes, currentJoonSem } from "../utils/constants";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Downlaods from "../components/Downloads";
import Feedback from "../components/Feedback";
// import LeftSideCardMessage from "../components/LeftSideCardMessage";

export default function Index() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const router = useRouter();

  let semParam = router.asPath.split("/")[1];

  const [sem, setSem] = useState(
    (() => {
      if (typeof window === "undefined") return "";
      if (semParam) {
        const semParamNum = parseInt(semParam);
        if (
          semParamNum >= 1 ||
          semParamNum <= currentJoonSem.split("sem")[1]
        ) {
          localStorage.setItem("sem", semParam);
          Router.replace(`/`);
          return `sem${semParamNum}`;
        }
        localStorage.setItem("sem", currentJoonSem.split("sem")[1]);
        Router.replace(`/`);
        return "";
      }
      return localStorage.getItem("sem")
        ? `sem${localStorage.getItem("sem")}`
        : "";
    })()
  );

  useEffect(() => {
    if (sem) {
      localStorage.setItem("sem", sem.split("sem")[1]);
    }
  }, [sem]);

  return (
    <>
      <Navbar
        text={`CSIT21 - Sem ${
          (sem || currentJoonSem).split("sem")[1]
        }`}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container
          sx={{
            py: 4,
            flex: 1,
          }}
        >
          <Box
            sx={{
              p: "env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left)",
            }}
          >
            <Grid container spacing={2}>
              <Grid
                sx={{
                  mx: "auto",
                }}
                size={{ xs: 12, sm: 10, md: 7 }}
              >
                <Materials
                  sem={sem || currentJoonSem}
                  setSem={setSem}
                />

                {/* Components */}

                {/* <ExamRoutine
                      examType={examTypes.prac}
                      sem={sem || currentJoonSem}
                      title="Practical Exam Routine"
                    /> */}
                {/* <ClassRoutine sem={sem || currentJoonSem} /> */}
                {/* <ExamRoutine
                      examType={examTypes.board}
                      sem="sem3"
                      subtitle={<>Exam time: 12:00 PM - 3:00 PM</>}
                    /> */}
                {/* <ExamRoutine examType={examTypes.prac} sem="sem3" /> */}
                {/* <LeftSideCardMessage title="Happy Dashain" /> */}
                {/* End Components */}
                {sem === "" || sem === currentJoonSem ? (
                  <>
                    <ExamRoutine
                      examType={examTypes.board}
                      sem={sem || currentJoonSem}
                      subtitle={<>Exam time: 12:00 PM - 3:00 PM</>}
                    />
                    <ClassRoutine sem={sem || currentJoonSem} />
                  </>
                ) : null}
                {sem === "sem5" ? (
                  <>
                    {/* <ExamRoutine
                      examType={examTypes.prac}
                      sem={sem}
                    /> */}
                    <ClassRoutine sem={sem} />
                  </>
                ) : null}
                {sem === "sem4" ? (
                  <>
                    {/* <ExamRoutine
                      examType={examTypes.board}
                      sem={sem}
                      subtitle={<>Exam time: 12:00 AM - 03:00 AM</>}
                    /> */}
                    <ClassRoutine sem={sem} />
                  </>
                ) : null}
                {sem === "sem3" ? (
                  <>
                    {/* <ExamRoutine
                      examType={examTypes.board}
                      sem={sem}
                      subtitle={<>Exam time: 12:00 AM - 03:00 AM</>}
                    /> */}
                    <ClassRoutine sem={sem} />
                  </>
                ) : null}
                {sem === "sem2" ? (
                  <>
                    {/* <ExamRoutine
                      examType={examTypes.board}
                      sem={sem}
                      subtitle={<>Exam time: 12:00 PM - 3:00 PM</>}
                    /> */}
                    <ClassRoutine sem={sem} />
                  </>
                ) : null}
              </Grid>
              <Grid
                sx={{
                  mx: "auto",
                }}
                size={{ xs: 12, sm: 10, md: 5 }}
              >
                <FrontPageGenerator sem={sem || currentJoonSem} />
                <Downlaods />
                <OpCodeFinder operate={isDesktop} />
                <TallyBar />
                <Feedback sem={sem || currentJoonSem} />
                <Soon />
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Footer />
        <CheckForUpdate />
      </Box>
    </>
  );
}
