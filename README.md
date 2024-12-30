## Ecorent project

### Our team:

- [Kobziev Daniil](https://t.me/Sevenpointnine) - Team lead
- [Yukhymenko Stas](https://t.me/stas_yukhymenko) - QA and Fullstack developer
- [Katynskyi Illya](https://t.me/girostark) - Front-end developer
- [Solohub Oleksandr](https://t.me/cyan_light) - Back-end developer

## Lab3

- Kobziev Daniil:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/pull/29/commits/d21fe9015467e2124f92c138c83812c1da69306d<br>
- Katynskyi Illya:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/pull/29/commits/a7ff402ee10d398cb70e39b3def9077d832a337f<br>
- Solohub Oleksandr && Yukhymenko Stas:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/pull/29/commits/3be06070e83ba871bdad6609570d16930987752b<br>

### Class Diagram

![EcoRent Class Diagram](https://github.com/user-attachments/assets/c85d205a-a158-4978-a30b-1ccd10b8ca93)

### ER Diagram

![EcoRent ER Diagram](https://github.com/user-attachments/assets/de656458-a995-47f4-abb7-a0ec1787665d)

### DFD Diagram

![EcoRent DFD Diagram](https://github.com/user-attachments/assets/ff790c3e-382a-4414-b30a-954b3d622a7d)

## Lab5

- Kobziev Daniil:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/01f4bdcf3980f649e699ece26581b7fa855451cf<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/45c88a89b2f52ce29cdc841dadb3352d387abf67<br>
- Yukhymenko Stas:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/deae4baf40312464acca72cb5a4867198f95ce62<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/09238b8ca2cba9e97dc6e85b05711c945a2a19b4<br>
- Katynskyi Illya:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/66341538ceaaad97ac1eaa9653f58b444b30da4e<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/04c2de4de8116e5f1516b6aaf25a5e8e057b3665<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/61abc7a8ebb32722d1cc71d7cc73d94f6b87590a<br>
- Solohub Oleksandr:<br>
  https://github.com/DIS-Guys/EcoRent_Backend/commit/fac8e254786e9eed2be519247fe89f1d0a46f901<br>

## Lab8

### Load testing with JMeter

![image_2024-12-31_00-05-22](https://github.com/user-attachments/assets/f0f8dd5b-4242-47b9-a79b-549c9eeec822)

![image_2024-12-31_00-06-21](https://github.com/user-attachments/assets/4516ec72-4252-4aed-abcc-3e8a6a6b918c)

![image_2024-12-31_00-06-58](https://github.com/user-attachments/assets/cf18f188-42d1-49cf-806b-090c6616fcf4)

Testing the user interface:
getUser: Throughput 591 requests/minute, error 79.
login: Throughput 593 requests/minute, error 23.
updateUser: Throughput 592 requests/minute, margin of error 27.

All requests for user interface testing show good and stable throughput.

## Lab9

### Short description

Our project is an innovative charging station rental site called EcoFlow, which allows users to both rent and lease portable power stations. The main goal of this project is to ensure the availability of chargers for those who need them on a short-term basis, as well as to create a platform for station owners to generate additional income. We aim to create an ecosystem that enables the convenient exchange of energy resources by optimising the use of charging stations. This solution will enable efficient use of resources by reducing the need to purchase expensive stations for temporary needs and will contribute to sustainable development as each station will be used as efficiently as possible.

![screenshot](https://i.imgur.com/0bT7HSm.jpeg)

## How to set up project

#### Front-end (React + TypeScript)

1. [Download node.js (version 22.11.0)](https://nodejs.org/en/blog/release/v22.11.0)
2. Run `npm install` in project`s root directory
3. Run `npm run dev` to launch front-end part
4. Visit http://localhost:5173/ to see the site ;)
5. Use `npx playwright test  --reporter=html` to run e2e tests (you need to have backend running)

#### Back-end (TypeScript + Express)

1. [Download node.js (version 22.11.0)](https://nodejs.org/en/blog/release/v22.11.0)
2. Run `npm install` in project`s root directory
3. Run `npm run dev` to launch back-end part
4. Now back-end is running ;)
5. Use `npm test` to run unit tests
6. Use `npm run test:api` to run integration tests with newman
