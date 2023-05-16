import { Route, Routes } from "react-router-dom";
import Main from "./container/Main/Main";
import NotFound from "./components/NotFound/NotFound";
import Report from "./components/Report/Report";
import LeftMenu from "./components/LeftMenu/LeftMenu";
import Registration from "./container/Registration/Registration";
import Details from "./container/Registration/Details/Details";
import CodeAuth from "./container/Registration/CodeAuth/CodeAuth";
import Terms from "./container/Terms/Terms";
import PrivacyPolicy from "./container/PrivacyPolicy/PrivacyPolicy";
import SingIn from "./container/Registration/SignIn/SingIn";
import ForgotPaassword from "./container/Registration/SignIn/ForgotPassword/ForgotPassword";
import ForgotPasswordCode from "./container/Registration/SignIn/ForgotPassword/ForgotPasswordCode/ForgotPasswordCode";
import Settings from "./components/Settings/Settings";
import { useEffect, useState } from "react";
import getFormattedWeatherData from "./data/main/weatherService";
import MapLocation from "./container/MapLocation/MapLocation";
import Layout from "./components/Layout/Layout";
import { ThemeProvider } from "./providers/ThemProvider";

function App() {
  const [query, setQuery] = useState({ q: "dubai" });
  const [units, setUnits] = useState(() => {
    const getSavedValue = localStorage.getItem("units");
    const initialValue = getSavedValue;
    return initialValue || "metric";
  });
  const [weather, setWeather] = useState(null);
  const [language, setLanguage] = useState(() => {
    const getSavedValue = localStorage.getItem("language");
    const initialValue = getSavedValue;
    return initialValue || "english";
  });

  console.log(
    "VK: https://vk.com/nullbebra",
    "Telegram: https://t.me/ItsZeroFour"
  );

  useEffect(() => {
    localStorage.setItem("units", units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const fetchForecastWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) => {
        setWeather(data);
      });
    };

    fetchForecastWeather();
  }, [query, units]);

  return (
    <ThemeProvider>
      <Layout>
        <div className="App">
          {weather && (
            <div>
              <div className="container">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Main
                        setQuery={setQuery}
                        weather={weather}
                        units={units}
                        language={language}
                      />
                    }
                  />
                  <Route path="/registration" element={<Registration />} />
                  <Route path="/registration/details" element={<Details />} />
                  <Route path="/registration/codeauth" element={<CodeAuth />} />
                  <Route path="/signIn" element={<SingIn />} />
                  <Route
                    path="/signIn/forgot-password"
                    element={<ForgotPaassword />}
                  />
                  <Route
                    path="/signIn/forgot-password/code"
                    element={<ForgotPasswordCode />}
                  />
                  <Route path="/signIn/forgot-password/newPassword" />
                  <Route
                    path="/settings"
                    element={
                      <Settings
                        setUnits={setUnits}
                        units={units}
                        setLanguage={setLanguage}
                        language={language}
                      />
                    }
                  />
                  <Route path="/location" element={<MapLocation />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/report" element={<Report />} />
                </Routes>
              </div>

              <LeftMenu />
            </div>
          )}
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;