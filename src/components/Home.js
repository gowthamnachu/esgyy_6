import React, { useState } from "react";
import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material";
import { keyframes } from "@mui/material";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import backgroundImage from '../assets/background1.jpg';

// Pulse Animation for Heart Icon
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: "50px auto",
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.6)",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(255, 105, 180, 0.2)",
  backdropFilter: "blur(5px)",
}));

const HeartIcon = styled(FavoriteIcon)({
  color: "#ff3d7f",
  fontSize: 50,
  marginBottom: 20,
  animation: `${pulse} 1.5s infinite ease-in-out`,
  filter: "drop-shadow(0px 0px 10px rgba(255, 105, 180, 0.5))",
});

const TimerBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginTop: "30px",
});

const TimeUnit = styled(Box)({
  background: "linear-gradient(45deg, #ff4081, #ff80ab)",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "90px",
  color: "white",
  textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
  boxShadow: "0 5px 15px rgba(255, 105, 180, 0.3)",
  textAlign: "center",
});

const Sidebar = styled(Box)(({ isHovered }) => ({
  position: 'fixed',
  left: isHovered ? 0 : -300,
  top: 0,
  width: 300,
  height: '100vh',
  background: 'rgba(255, 255, 255, 0.9)',
  transition: 'left 0.3s ease-in-out',
  zIndex: 1000,
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    left: 0
  }
}));

const Background = styled(Box)({  
  minHeight: "100vh",
  background: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const Home = () => {
  const [timeElapsed, setTimeElapsed] = useState({});
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const startDate = moment("2024-09-06 18:15:00");
  const [birthdayCountdown, setBirthdayCountdown] = useState({ gow: {}, snig: {} });

  React.useEffect(() => {
    const calculateAge = (birthDate) => {
      const now = moment();
      const nextBirthday = moment(birthDate).year(now.year());
      
      if (nextBirthday.isBefore(now)) {
        nextBirthday.add(1, 'year');
      }
      
      const duration = moment.duration(nextBirthday.diff(now));
      return {
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      };
    };

    const timer = setInterval(() => {
      setBirthdayCountdown({
        gow: calculateAge('2005-04-05'),
        snig: calculateAge('2006-03-24')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const duration = moment.duration(now.diff(startDate));

      setTimeElapsed({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const username = localStorage.getItem("user");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderBirthdayTimer = (person) => {
    const countdown = birthdayCountdown[person];
    return (
      <TimerBox sx={{ flexDirection: 'column', gap: 2 }}>
        <TimeUnit>
          <Typography variant="h4">{countdown.days || 0}</Typography>
          <Typography>Days</Typography>
        </TimeUnit>
        <TimeUnit>
          <Typography variant="h4">{countdown.hours || 0}</Typography>
          <Typography>Hours</Typography>
        </TimeUnit>
        <TimeUnit>
          <Typography variant="h4">{countdown.minutes || 0}</Typography>
          <Typography>Minutes</Typography>
        </TimeUnit>
        <TimeUnit>
          <Typography variant="h4">{countdown.seconds || 0}</Typography>
          <Typography>Seconds</Typography>
        </TimeUnit>
      </TimerBox>
    );
  };

  return (
    <Background>
      <Box
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        sx={{ position: 'fixed', left: 0, top: 0, width: '20px', height: '100vh' }}
      />
      <Sidebar 
        isHovered={sidebarHovered}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <Typography variant="h5" sx={{ mb: 3, color: '#ff4081', textAlign: 'center' }}>
          Birthday Countdown
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: '#666',
              '&.Mui-selected': { color: '#ff4081' }
            }
          }}
        >
          <Tab label="Gow" />
          <Tab label="Snig" />
        </Tabs>
        {selectedTab === 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Next Birthday In:
            </Typography>
            {renderBirthdayTimer('gow')}
          </Box>
        )}
        {selectedTab === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Next Birthday In:
            </Typography>
            {renderBirthdayTimer('snig')}
          </Box>
        )}
      </Sidebar>
      <StyledPaper elevation={5}>
        <HeartIcon />
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#ff4081",
            fontWeight: "bold",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          My Love, {username === "snig" ? "Beautiful" : "Handsome"}! 💖
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#666",
            fontStyle: "italic",
            marginBottom: 4,
            fontSize: "18px",
          }}
        >
          Our hearts have been dancing together since...
        </Typography>

        <TimerBox>
          <TimeUnit>
            <Typography variant="h4">{timeElapsed.days || 0}</Typography>
            <Typography>Days</Typography>
          </TimeUnit>
          <TimeUnit>
            <Typography variant="h4">{timeElapsed.hours || 0}</Typography>
            <Typography>Hours</Typography>
          </TimeUnit>
          <TimeUnit>
            <Typography variant="h4">{timeElapsed.minutes || 0}</Typography>
            <Typography>Minutes</Typography>
          </TimeUnit>
          <TimeUnit>
            <Typography variant="h4">{timeElapsed.seconds || 0}</Typography>
            <Typography>Seconds</Typography>
          </TimeUnit>
        </TimerBox>

        <Typography
          variant="body1"
          sx={{
            marginTop: 4,
            color: "#444",
            fontStyle: "italic",
            fontSize: "16px",
          }}
        >
          Since September 6, 2024, 6:15 PM – Forever Yours 💞
        </Typography>
      </StyledPaper>
    </Background>
  );
};

export default Home;
