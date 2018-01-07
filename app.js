"use strict";
require('dotenv').config()

const algoliasearch = require('algoliasearch');
const axios = require('axios');

const appid = process.env.ALGOLIA_APPID;
const token = process.env.ALGOLIA_TOKEN;
const client = algoliasearch(appid, token);
const index  = client.initIndex('forge_search');
const endpoint = 'https://forge-blog.netlify.com/api'

index.setSettings({
  searchableAttributes: [
    'title',
    'content_html'
  ],
  customRanking: [
    'desc(popularity)'
  ]
});

const getForgeData = async () => {
  try {
    const response = await axios.get(endpoint);
    return response.data.items;
  } catch (e) {
    console.error(e); 
  }
};

const updateAlgolia = async () => {
  try {
    getForgeData().then(result => index.addObjects(result));
  } catch (e) {
    console.error(e); 
  }
};

updateAlgolia();