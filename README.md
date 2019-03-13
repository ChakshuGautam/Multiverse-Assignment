### Multiverse-Assignment
There are multiple parallel universes. Each person in a universe has a identity `id` and a power. Power can be positive or negative. All people are divided into families identified by `family_id`. A special creature from 4th dimension has been given a task to 
List families in a particular universe
Check if families with given family_id have same power in all universes. If powers don’t match then family_id is unbalanced
Find unbalanced family_ids
Balance given family_id
You have to help him by providing REST API to store the data of universes and to do the above tasks. If he is happy he might give you a portal gun to hop between universes. Best of luck.

--
You can use any Java/Javascript backend framework with MySQL/PostgreSQL
Please provide a README and seed to data for testing the APIs

### Starting App
```
npm install
npm start
```

### Seed Data
See `initial-data.csv`. Call the API to add data from CSV to Database.


### API Testing
Import the following collection to Postman to test the APIs directly.
https://www.getpostman.com/collections/c28d4cf75a766ec742c9


### Hosted At Heroku
https://cryptic-shore-11289.herokuapp.com

### TODO
- [x] List families in a particular universe
- [x] Check if families with given family_id have same power in all universes. If powers don’t match then family_id is unbalanced
- [x] Find unbalanced family_ids
- [x] Seed Data Added as CSV
- [x] Balance given family_id
- [ ] Speed improvements in the balance API.
- [ ] Improve API Design
- [ ] Implement error handling
