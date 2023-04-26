const express = require("express");

const {
  lowerIncomeAndLuxryCar,
  maleUsersAndHigherPhonePrice,
  lastNameAndGreaterQuoteLength,
  luxuryCarAndNoDigitInEmail,
  topTenCities,
} = require("../controllers/userControllers");

const router = express.Router();

// 1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
router.route("/lowerIncomeAndLuxryCar").get(lowerIncomeAndLuxryCar);

// 2. Male Users which have phone price greater than 10,000
router.route("/maleUsersAndHigherPhonePrice").get(maleUsersAndHigherPhonePrice);

// 3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
router
  .route("/lastNameAndGreaterQuoteLength")
  .get(lastNameAndGreaterQuoteLength);

// 4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
router.route("/luxuryCarAndNoDigitInEmail").get(luxuryCarAndNoDigitInEmail);

// 5. Show the data of top 10 cities which have the highest number of users and their average income.
router.route("/topTenCities").get(topTenCities);

module.exports = router;
