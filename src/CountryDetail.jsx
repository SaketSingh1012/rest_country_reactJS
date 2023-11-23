// CountryDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./CountryDetail.css";

function CountryDetail() {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${countryName}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setCountry(data[0]);
        } else {
          console.error("Invalid data structure or empty response");
        }
      } catch (error) {
        console.error("Error fetching country details:", error);
      }
    };

    fetchData();
  }, [countryName]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleBorderClick = async (cca3) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${cca3}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const borderCountryName = data[0].name.common;
        history.push(`/${borderCountryName}`);
      } else {
        console.error("Invalid data structure or empty response");
      }
    } catch (error) {
      console.error("Error fetching border country details:", error);
    }
  };

  const renderLanguages = () => {
    if (country && country.languages && country.languages.fra) {
      return country.languages.fra;
    }
    return "None";
  };

  const renderArrayData = (dataArray) => {
    if (Array.isArray(dataArray) && dataArray.length > 0) {
      return dataArray.join(", ");
    }
    return "None";
  };

  return (
    <>
      <button className="back-button" onClick={handleGoBack}>
        Back
      </button>
      {country ? (
        <div className="country-detail">
          <div className="flag">
            <img
              src={country.flags?.svg}
              alt={`${country.name?.common} flag`}
            />
          </div>
          <div className="details">
            <div className="main_content">
              <div className="content1">
                <h2>{country.name?.common}</h2>
                <p>
                  Native Name: {country.name?.nativeName?.eng?.common || "None"}
                </p>
                <p>Population: {country.population || "None"}</p>
                <p>Region: {country.region || "None"}</p>
                <p>Subregion: {country.subregion || "None"}</p>
                <p>Capital: {country.capital?.[0] || "None"}</p>
              </div>
              <div className="content2">
                <p>
                  Top Level Domain: {renderArrayData(country.tld) || "None"}
                </p>
                <p>
                  Currencies:{" "}
                  {Object.keys(country.currencies || {}).join(", ") || "None"}
                </p>
                <p>Languages: {renderLanguages()}</p>
              </div>
            </div>
            <div className="border">
              <p>Borders:</p>
              {country.borders.length > 0 ? (
                <>
                  {country.borders.map((border) => (
                    <button
                      key={border}
                      onClick={() => handleBorderClick(border)}
                      className="border-button"
                    >
                      {border}
                    </button>
                  ))}
                </>
              ) : (
                <p>None</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default CountryDetail;
