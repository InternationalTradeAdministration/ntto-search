import 'babel-polyfill';

const config = Object.assign({
  development: {
    api: {
      i94_url: 'http://127.0.0.1:3000/v1/i94_monthly_data/search',
      i92_url: 'http://127.0.0.1:3000/v1/i92_entries/search',
      apiKey: 'devkey'
    },
  },
  production: {
    api: {
      i94_url: 'https://api.govwizely.com/v1/i94_monthly_data/search',
      i92_url: 'https://api.govwizely.com/v1/i92_entries/search',
      apiKey: 'Z48wSr3E3nNN4itDUvE4Clje',
    },
  },
});

export default config[process.env.NODE_ENV];