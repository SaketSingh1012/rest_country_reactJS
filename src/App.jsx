// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import CountryDetail from "./CountryDetail";
import { ThemeProvider } from "./ThemeContext";
import { useTheme } from "./ThemeUtil";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const { darkMode, toggleTheme } = useTheme();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchInput.toLowerCase())
  );

  const countriesInSelectedRegion = countries.filter(
    (country) => country.region === selectedRegion
  );

  const countriesToShow =
    searchInput === ""
      ? selectedRegion === ""
        ? countries
        : countriesInSelectedRegion
      : filteredCountries.filter((country) =>
          country.region.includes(selectedRegion)
        );

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const countriesInRows = chunkArray(countriesToShow, 4);

  return (
    <ThemeProvider>
      <Router>
        <div className={`app-container ${darkMode ? "dark" : "light"}`}>
          <div className="header">
            <div className="text_world">Where in the world?</div>
            <div className="dark_mode">
              <button className="dark_button" onClick={toggleTheme}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
          <div className="search-container">
            {window.location.pathname === "/" && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Search for a country"
                    value={searchInput}
                    onChange={handleSearch}
                  />
                </div>
                <div>
                  <select value={selectedRegion} onChange={handleRegionChange}>
                    <option value="">Filter by Region</option>
                    {Array.from(
                      new Set(countries.map((country) => country.region))
                    ).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="countries-container">
            <Switch>
              <Route path="/:countryName" component={CountryDetail} />
              <Route exact path="/">
                {countriesInRows.map((row, index) => (
                  <div key={index} className="row-container">
                    {row.map((country) => (
                      <div
                        key={country.cca3}
                        className="country-card"
                        onClick={() =>
                          (window.location.href = `/${country.name.common}`)
                        }
                      >
                        <img
                          src={country.flags?.svg}
                          alt={`${country.name.common} flag`}
                          className="flag-image"
                        />
                        <p>{country.name.common}</p>
                        <p>Region: {country.region}</p>
                        <p>Capital: {country.capital}</p>
                        <p>Population: {country.population}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
