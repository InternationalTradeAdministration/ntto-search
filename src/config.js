import 'babel-polyfill';

const config = Object.assign({
  development: {
    api: {
      i94_url: 'http://127.0.0.1:3000/v1/i94_monthly_data/search',
      i92_url: 'http://127.0.0.1:3000/v1/i92_entries/search',
      spending_data_url: 'http://127.0.0.1:3000/v1/ntto_spending_data/search',
      siat_url: 'http://127.0.0.1:3000/v1/siat_data/search',
      apiKey: 'devkey'
    },
  },
  production: {
    api: {
      i94_url: 'https://api.trade.gov/v1/i94_monthly_data/search',
      i92_url: 'https://api.trade.gov/v1/i92_entries/search',
      spending_data_url: 'https://api.trade.gov/v1/ntto_spending_data/search',
      siat_url: 'https://api.trade.gov/v1/siat_data/search',
      apiKey: 'O6fmOIPtrvDlqoDe2_6UbKJc',
    },
  },
});

export default config[process.env.NODE_ENV];