import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RoyaltiesContext = createContext();

const initialState = {
  royalties: [],
  filters: {
    quarter: '',
    year: new Date().getFullYear(),
    artist: '',
    song: '',
    store: '',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  settings: {
    baseCurrency: 'USD',
    exchangeRates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      AUD: 1.35,
      JPY: 110
    }
  }
};

const sampleRoyalties = [
  {
    id: '1',
    songTitle: 'Summer Nights',
    artistName: 'The Melody Makers',
    store: 'Spotify',
    quarter: 'Q1',
    year: 2024,
    streams: 125000,
    amount: 850.50,
    currency: 'USD',
    date: '2024-01-15',
    territory: 'United States'
  },
  {
    id: '2',
    songTitle: 'Electric Dreams',
    artistName: 'Neon Pulse',
    store: 'Apple Music',
    quarter: 'Q1',
    year: 2024,
    streams: 89000,
    amount: 712.30,
    currency: 'EUR',
    date: '2024-02-20',
    territory: 'Germany'
  },
  {
    id: '3',
    songTitle: 'Midnight Jazz',
    artistName: 'Blue Note Collective',
    store: 'YouTube Music',
    quarter: 'Q2',
    year: 2024,
    streams: 67500,
    amount: 445.80,
    currency: 'GBP',
    date: '2024-04-10',
    territory: 'United Kingdom'
  },
  {
    id: '4',
    songTitle: 'Summer Nights',
    artistName: 'The Melody Makers',
    store: 'Amazon Music',
    quarter: 'Q2',
    year: 2024,
    streams: 43200,
    amount: 298.75,
    currency: 'CAD',
    date: '2024-05-18',
    territory: 'Canada'
  },
  {
    id: '5',
    songTitle: 'Ocean Waves',
    artistName: 'Coastal Sounds',
    store: 'Spotify',
    quarter: 'Q3',
    year: 2024,
    streams: 156000,
    amount: 1120.45,
    currency: 'USD',
    date: '2024-07-22',
    territory: 'United States'
  }
];

function royaltiesReducer(state, action) {
  switch (action.type) {
    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        royalties: sampleRoyalties
      };
    case 'ADD_ROYALTY':
      return {
        ...state,
        royalties: [...state.royalties, { ...action.payload, id: uuidv4() }]
      };
    case 'UPDATE_ROYALTY':
      return {
        ...state,
        royalties: state.royalties.map(royalty =>
          royalty.id === action.payload.id ? action.payload : royalty
        )
      };
    case 'DELETE_ROYALTY':
      return {
        ...state,
        royalties: state.royalties.filter(royalty => royalty.id !== action.payload)
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'UPDATE_EXCHANGE_RATES':
      return {
        ...state,
        settings: {
          ...state.settings,
          exchangeRates: { ...state.settings.exchangeRates, ...action.payload }
        }
      };
    default:
      return state;
  }
}

export function RoyaltiesProvider({ children }) {
  const [state, dispatch] = useReducer(royaltiesReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('royaltiesData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_SAMPLE_DATA' });
        if (parsedData.royalties) {
          parsedData.royalties.forEach(royalty => {
            dispatch({ type: 'ADD_ROYALTY', payload: royalty });
          });
        }
        if (parsedData.settings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: parsedData.settings });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        dispatch({ type: 'LOAD_SAMPLE_DATA' });
      }
    } else {
      dispatch({ type: 'LOAD_SAMPLE_DATA' });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('royaltiesData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [state]);

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const { exchangeRates } = state.settings;
    if (fromCurrency === toCurrency) return amount;
    
    const usdAmount = amount / exchangeRates[fromCurrency];
    return usdAmount * exchangeRates[toCurrency];
  };

  const value = {
    ...state,
    dispatch,
    convertCurrency
  };

  return (
    <RoyaltiesContext.Provider value={value}>
      {children}
    </RoyaltiesContext.Provider>
  );
}

export function useRoyalties() {
  const context = useContext(RoyaltiesContext);
  if (!context) {
    throw new Error('useRoyalties must be used within a RoyaltiesProvider');
  }
  return context;
}