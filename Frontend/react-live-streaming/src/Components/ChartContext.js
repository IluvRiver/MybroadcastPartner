import React, { createContext, useState } from 'react';

const ChartContext = createContext();

const ChartProvider = ({ children }) => {
  const [angrySeries, setAngrySeries] = useState([]);
  const [happySeries, setHappySeries] = useState([]);
  const [neutralSeries, setNeutralSeries] = useState([]);
  const [sadSeries, setSadSeries] = useState([]);
  const [surpriseSeries, setSurpriseSeries] = useState([]);

  return (
    <ChartContext.Provider
      value={{
        angrySeries,
        setAngrySeries,
        happySeries,
        setHappySeries,
        neutralSeries,
        setNeutralSeries,
        sadSeries,
        setSadSeries,
        surpriseSeries,
        setSurpriseSeries,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartProvider };