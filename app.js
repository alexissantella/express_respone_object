'use strict';

const express = require('express');
const morgan = require('morgan');
const store = require('./playstore.js');

const app = express();
app.use(morgan('common'));

app.get('/', (req, res) => {
  res
  .send('Hello Express!');
});

module.exports = app;
// app.listen(8000, () => {
//   console.log('Express server is listening on port 8000!');
// });


app.get('/app', (req, res) => {
  //1. get values from the request

  const sort = req.query.sort;
  const genres = req.query.genres;
  let filtered_store = store;
  
  //2. validate the values

  if(genres !== undefined){
    if(genres.toLowerCase() !== 'action' && genres.toLowerCase() !=='puzzle' && genres.toLowerCase() !== 'strategy' && genres.toLowerCase() !== 'casual' && genres.toLowerCase() !=='arcade' && genres.toLowerCase() !== 'card'){
      return res.status(400).send('can only filter by Action,Puzzle,Strategy,Casual,Arcade,or Card');
    }
    filtered_store = store.filter(app => {
      return app.Genres.includes(genres.charAt(0).toUpperCase() + genres.slice(1)); 
    });
  }

  if(sort !== undefined){
    if(sort.toLowerCase() !== 'rating' && sort.toLowerCase() !=='app'){
      return res.status(400).send('Can only sort by rating or app');
    }
    else if(sort.toLowerCase() === 'rating'){
      filtered_store.sort(function(a, b) {
        return b.Rating - a.Rating;
      });
    }
    else if(sort.toLowerCase() === 'app'){
      filtered_store.sort(function(a, b) {
        if(a.App < b.App) { return -1; }
        if(a.App > b.App) { return 1; }
        return 0;
      });
    }
  }


 
  res
    .json(filtered_store);
  
});
  