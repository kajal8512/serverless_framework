const axios = require('axios');
const config = require('../config');

async function refreshToken() {
    const apiUrl = 'https://accounts.zoho.in/oauth/v2/token';
    const refresh_token = config.zohoTokes.refresh_token;
    const client_id = config.zohoTokes.client_id;
    const client_secret = config.zohoTokes.client_secret;
    const grant_type = 'refresh_token';

    try {
        const response = await axios.post(apiUrl, null, {
          params: {
            refresh_token,
            client_id,
            client_secret,
            grant_type,
          },
        });

        const data = response.data.access_token;
        // console.log('Token:', data);
        return data;
        
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
      }
    }
    
    async function zohoData(event) {
      // Access query parameters from the event object
      const queryParams = event.queryStringParameters;
      // Validate and extract required parameters
      if (!queryParams.reportName) {
          return {
              statusCode: 400,
              body: 'Missing reportName parameter',
          };
      }
      const reportName = queryParams.reportName;
      const params = queryParams.params;
      const token = await refreshToken();
      const apiUrl = "https://creator.zoho.in/api/v2.1/navgurukul/ghar/report/"+reportName;
      const headers = {
          Authorization: `Zoho-oauthtoken ${token}`,
          environment: 'development',
          demo_user_name: 'kajalzoho@navgurukul.org',
          Accept: 'application/json',
      };
      try {
        // If params is not provided, pass an empty object
        const response = await axios.get(apiUrl, { headers, params: params || {} });
        return response.data;
      } catch (error) {
          return error; 
      }
  }

module.exports = {refreshToken, zohoData };