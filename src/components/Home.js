import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { styled } from "@mui/material";
import { keyframes } from "@mui/material";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import BackgroundSelector from './BackgroundSelector.js';
import background1 from '../assets/background1.jpg';
import background2 from '../assets/background.jpg';
import Sidebar from './Sidebar.js';
import Confetti from 'react-confetti';

import CakeRoundedIcon from '@mui/icons-material/CakeRounded';


// Pulse Animation for Heart Icon
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const sparkle = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const floatWithRotate = keyframes`
  0% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(-5deg); }
`;

const fallingHearts = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0.3; }
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

const Background = styled(Box)(({ bgImage }) => ({
  minHeight: "100vh",
  background: `url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
}));

// Update the Celebration component
const Celebration = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, rgba(255,192,203,0.95) 0%, rgba(255,182,193,0.95) 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 0l2.5 7.5H20l-6 4.5L16.5 20 10 15.5 3.5 20 6 12 0 7.5h7.5L10 0z" fill="rgba(255,255,255,0.2)"%3E%3C/path%3E%3C/svg%3E")',
    animation: `${sparkle} 2s linear infinite`
  }
}));

const FallingHeart = styled(Box)({
  position: 'absolute',
  top: 0,
  animation: `${fallingHearts} 3s linear infinite`,
  fontSize: '24px',
  color: 'white',
  textShadow: '0 0 5px rgba(255,255,255,0.5)',
  zIndex: 1
});

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const BirthdayCelebration = ({ person }) => (
  <Celebration>
    {/* Floating Hearts */}
    {Array(15).fill().map((_, i) => (
      <FallingHeart
        key={i}
        sx={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          fontSize: `${24 + Math.random() * 12}px`,
          opacity: 0.9
        }}
      >
        ❤️
      </FallingHeart>
    ))}

    <Box sx={{ 
      textAlign: 'center',
      padding: '3rem',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 8px 32px rgba(255, 105, 180, 0.3)',
      animation: `${float} 3s infinite ease-in-out`,
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <CakeRoundedIcon sx={{ 
        fontSize: 100,
        color: 'white',
        filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.9))',
        marginBottom: 4,
        animation: `${floatWithRotate} 3s infinite ease-in-out`
      }} />

      <Typography sx={{
        fontSize: '6rem',
        fontFamily: '"Dancing Script", cursive',
        fontWeight: 800,
        background: 'linear-gradient(90deg, #FFF 20%, #FFB6C1 50%, #FFF 80%)',
        backgroundSize: '200% auto',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: `${gradientShift} 3s linear infinite`,
        marginBottom: '1.5rem',
        textShadow: '0 0 40px rgba(255,255,255,0.5)',
        letterSpacing: '2px',
        lineHeight: 1.2
      }}>
        Happy Birthday <br/> Chiddhu!
      </Typography>

      <Typography sx={{
        fontSize: '2.5rem',
        color: 'white',
        fontFamily: '"Dancing Script", cursive',
        marginTop: '2rem',
        textShadow: '2px 2px 15px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.5)',
        fontWeight: 600,
        animation: `${float} 2s infinite ease-in-out`,
        letterSpacing: '1px'
      }}>
        ✨ With All My Love ✨
      </Typography>
    </Box>

    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={true}
      numberOfPieces={150}
      gravity={0.2}
      colors={['#FFF', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFD700']}
    />
  </Celebration>
);

const Header = styled(Box)(({ show }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  padding: '20px',
  display: 'flex',
  justifyContent: 'center', // Center the content
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 4px 30px rgba(255, 105, 180, 0.25)',
  borderRadius: '0 0 20px 20px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 4px 30px rgba(255, 105, 180, 0.3)'
  },
  transition: 'all 0.3s ease'
}));

const WebsiteTitle = styled(Typography)(({ theme }) => ({
  color: 'transparent',
  background: 'linear-gradient(45deg, #ff4081 30%, #ff80ab 90%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: '"Dancing Script", cursive',
  textShadow: '2px 2px 4px rgba(255, 105, 180, 0.2)',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #ff1744 30%, #ff4081 90%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text'
  },
  transition: 'all 0.3s ease'
}));

const HeaderTimerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  padding: '5px 10px',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(5px)',
  boxShadow: '0 4px 15px rgba(255, 105, 180, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 105, 180, 0.2)'
  },
  transition: 'all 0.3s ease'
}));

const Home = () => {
  const [timeElapsed, setTimeElapsed] = useState({});
  // Remove unused background state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [backgrounds, setBackgrounds] = useState([]);
  const [isBirthday, setIsBirthday] = useState(false);
  const [birthdayPerson, setBirthdayPerson] = useState('');
  const [nextBirthday, setNextBirthday] = useState({});
  const [showBirthdayWishes, setShowBirthdayWishes] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [gowBirthday, setGowBirthday] = useState({});
  const [snigBirthday, setSnigBirthday] = useState({});
  
  const startDate = moment("2024-09-06 18:15:00");
  
  const birthdays = useMemo(() => ({
    gow: { date: '2005-04-05', name: 'Gow' },
    snig: { date: '2006-03-24', name: 'Snig' }
  }), []);

  const fetchBackgrounds = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/backgrounds');
      if (response.ok) {
        const data = await response.json();
        const allBackgrounds = [
          { id: 'preset1', type: 'preset', url: background1 },
          { id: 'preset2', type: 'preset', url: background2 },
          ...data.filter(bg => bg.backgroundValue).map(bg => ({
            id: bg._id,
            type: bg.backgroundType,
            url: bg.backgroundType === 'custom' 
              ? `http://localhost:5000/uploads/${bg.backgroundValue}`
              : bg.backgroundValue
          }))
        ];
        setBackgrounds(allBackgrounds);
        
        if (currentSlideIndex >= allBackgrounds.length) {
          setCurrentSlideIndex(0);
        }
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      setBackgrounds([
        { id: 'preset1', type: 'preset', url: background1 },
        { id: 'preset2', type: 'preset', url: background2 }
      ]);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    if (backgrounds.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % backgrounds.length;
          console.log('Changing background to index:', nextIndex); // Debug log
          return nextIndex;
        });
      }, 5000);

      return () => clearInterval(slideInterval);
    }
  }, [backgrounds.length]); // Changed dependency to backgrounds.length

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        // Remove user-specific fetch
        const response = await fetch('http://localhost:5000/api/backgrounds');
        if (response.ok) {
          const data = await response.json();
          // Combine preset and custom backgrounds
          const allBackgrounds = [
            { id: 'preset1', type: 'preset', url: background1 },
            { id: 'preset2', type: 'preset', url: background2 },
            ...data.map(bg => ({
              id: bg._id,
              type: bg.backgroundType,
              url: bg.backgroundType === 'custom' 
                ? `http://localhost:5000/uploads/${bg.backgroundValue}`
                : bg.backgroundValue
            }))
          ];
          console.log('Fetched backgrounds:', allBackgrounds); // Debug log
          setBackgrounds(allBackgrounds);
        }
      } catch (error) {
        console.error('Error fetching backgrounds:', error);
        // Fallback to preset backgrounds
        setBackgrounds([
          { id: 'preset1', type: 'preset', url: background1 },
          { id: 'preset2', type: 'preset', url: background2 }
        ]);
      }
    };

    fetchBackgrounds();
    const intervalId = setInterval(fetchBackgrounds, 30000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Add event listener for background updates
  useEffect(() => {
    const handleBackgroundUpdate = () => {
      fetchBackgrounds();
    };

    window.addEventListener('backgroundsUpdated', handleBackgroundUpdate);
    return () => window.removeEventListener('backgroundsUpdated', handleBackgroundUpdate);
  }, [fetchBackgrounds]);

  React.useEffect(() => {
    const handleMouseMove = (event) => {
      setShowHeader(event.clientY < 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const duration = moment.duration(now.diff(startDate));
      const username = localStorage.getItem('user');
      
      // Check if it's birthday
      const today = now.format('MM-DD');
      const userBirthday = moment(birthdays[username].date).format('MM-DD');
      
      if (today === userBirthday) {
        setIsBirthday(true);
        setShowBirthdayWishes(true);
        setBirthdayPerson(birthdays[username].name);
        
        setTimeout(() => {
          setShowBirthdayWishes(false);
        }, 10000);
      } else {
        setIsBirthday(false);
        setShowBirthdayWishes(false);
      }
      
      // Calculate birthdays for both users
      Object.entries(birthdays).forEach(([user, data]) => {
        const nextBirthdayDate = moment(data.date).year(now.year());
        if (nextBirthdayDate.isBefore(now)) {
          nextBirthdayDate.add(1, 'year');
        }
        const birthdayDuration = moment.duration(nextBirthdayDate.diff(now));
        
        const countdown = {
          days: Math.floor(birthdayDuration.asDays()),
          hours: birthdayDuration.hours(),
          minutes: birthdayDuration.minutes(),
          seconds: birthdayDuration.seconds()
        };

        if (user === 'gow') {
          setGowBirthday(countdown);
        } else if (user === 'snig') {
          setSnigBirthday(countdown);
        }

        if (user === username) {
          setNextBirthday(countdown);
        }
      });

      setTimeElapsed({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [birthdays, startDate]);

  const username = localStorage.getItem("user");

  const handleBackgroundChange = useCallback((newBackground) => {
    // Update the background changing logic to work with currentSlideIndex
    const newIndex = backgrounds.findIndex(bg => bg.url === newBackground.backgroundValue);
    if (newIndex !== -1) {
      setCurrentSlideIndex(newIndex);
    }
  }, [backgrounds]);

  // Update background image selection
  const currentBackground = backgrounds[currentSlideIndex];
  const bgImage = currentBackground?.url || background1;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {showHeader && (
        <Header>
          <Box sx={{ position: 'absolute', left: '20px' }} /> {/* Spacer */}
          <WebsiteTitle>esgyy_6</WebsiteTitle>
          <Box sx={{ 
            position: 'absolute', 
            right: '20px',
            display: 'flex',
            gap: 2
          }}>
            <HeaderTimerBox>
              <Typography variant="body2">Gow's Birthday</Typography>
              <Typography variant="h6">{gowBirthday.days || 0} days</Typography>
            </HeaderTimerBox>
            <HeaderTimerBox>
              <Typography variant="body2">Snig's Birthday</Typography>
              <Typography variant="h6">{snigBirthday.days || 0} days</Typography>
            </HeaderTimerBox>
          </Box>
        </Header>
      )}
      <Background 
        bgImage={bgImage}
        sx={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        {isBirthday && showBirthdayWishes && (
          <BirthdayCelebration person={birthdayPerson} />
        )}
        
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            left: isSidebarOpen ? '260px' : '20px',
            top: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            transition: 'left 0.3s ease-in-out',
            zIndex: 1100
          }}
        >
          <MenuIcon />
        </IconButton>
        <Sidebar isOpen={isSidebarOpen} />
        <BackgroundSelector onBackgroundChange={handleBackgroundChange} />
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

          <HeaderTimerBox>
            <TimeUnit>
              <Typography variant="h4">{nextBirthday.days || 0}</Typography>
              <Typography>Days until next birthday!</Typography>
            </TimeUnit>
          </HeaderTimerBox>

          <Typography
            variant="h6"
            sx={{
              color: "#666",
              fontStyle: "italic",
              marginTop: 4,
              marginBottom: 2,
              fontSize: "18px",
            }}
          >
            Time together...
          </Typography>

          <HeaderTimerBox>
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
          </HeaderTimerBox>

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
    </>
  );
};

export default Home;
