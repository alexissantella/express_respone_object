const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');


describe('GET /app', () => {
     it('should return an array of apps', () => {
      return supertest(app)
        .get('/app')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            const app = res.body[0];
            expect(app).to.include.all.keys(
              'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver');
        });
      });

      it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/app')
          .query({ sort: 'MISTAKE' })
          .expect(400, 'Can only sort by rating or app');
      });
    
      it('should sort by app name', () => {
        return supertest(app)
          .get('/app')
          .query({ sort: 'app' })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
    
            let i = 0;
            // iterate once less than the length of the array
            // because we're comparing 2 items in the array at a time
            while (i < res.body.length - 1) {
              // compare book at `i` with next book at `i + 1`
              const appAtI = res.body[i];
              const appAtIPlus1 = res.body[i + 1];
              // if the next book is less than the book at i,
              if (appAtIPlus1.title < appAtI.title) {
                // the books were not sorted correctly
                sorted = false;
                break; // exit the loop
              }
              i++;
            }
            expect(sorted).to.be.true;
          });
      });
  });