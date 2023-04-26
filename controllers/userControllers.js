const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/*
LIST OF CONTROLLERS
1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
2. Male Users which have phone price greater than 10,000
3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
5. Show the data of top 10 cities which have the highest number of users and their average income.
*/

// 1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
const lowerIncomeAndLuxryCar = asyncHandler(async (req, res) => {
  const users = await User.find({
    income: { $lt: "$5" },
    car: { $in: ["BMW", "Mercedes"] },
  });

  if (users) {
    res.status(200).json({
      success: true,
      data: users,
    });
  } else {
    res.status(404).json({
      success: false,
      data: "Details could not be found",
    });
  }
});

// 2. Male Users which have phone price greater than 10,000
const maleUsersAndHigherPhonePrice = asyncHandler(async (req, res) => {
  const users = await User.find({
    gender: "Male",
    phone_price: { $gt: "10000" },
  });

  if (users) {
    res.status(200).json({
      success: true,
      data: users,
    });
  } else {
    res.status(404).json({
      success: false,
      data: "Details could not be found",
    });
  }
});

// 3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
const lastNameAndGreaterQuoteLength = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $addFields: {
        new_field: {
          $concat: [
            "m",
            { $substr: ["$last_name", 1, { $strLenCP: "$last_name" }] },
          ],
        },
      },
    },
    {
      $match: {
        last_name: { $regex: /^M/i },
      },
    },
    {
      $match: {
        quote: { $regex: /^.{16,}$/ },
      },
    },
    {
      $match: {
        email: {
          $regex: new RegExp(".*" + { $regexEscape: "$new_field" } + ".*", "i"),
        },
        // regexEscape to ensure that any special characters are not interpreted to be a part of regex expression
      },
    },
  ]);

  if (users) {
    res.status(200).json({
      success: true,
      length: users.length,
      data: users,
    });
  } else {
    res.status(404).json({
      success: false,
      data: "Details could not be found",
    });
  }
});

// 4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
const luxuryCarAndNoDigitInEmail = asyncHandler(async (req, res) => {
  const users = await User.find({
    car: { $in: ["BMW", "Mercedes", "Audi"] },
    email: { $not: { $regex: /[0-9]/ } },
  });

  if (users) {
    res.status(200).json({
      success: true,
      data: users,
    });
  } else {
    res.status(404).json({
      success: false,
      data: "Details could not be found",
    });
  }
});

// 5. Show the data of top 10 cities which have the highest number of users and their average income.
const topTenCities = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: "$city",
        user_count: { $sum: 1 },
        avg_income: { $avg: { $toDouble: { $substr: ["$income", 1, -1] } } },
      },
    },
    {
      $sort: {
        user_count: -1,
        avg_income: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  if (users) {
    res.status(200).json({
      success: true,
      data: users,
    });
  } else {
    res.status(404).json({
      success: false,
      data: "Details could not be found",
    });
  }
});

module.exports = {
  lowerIncomeAndLuxryCar,
  maleUsersAndHigherPhonePrice,
  lastNameAndGreaterQuoteLength,
  luxuryCarAndNoDigitInEmail,
  topTenCities,
};
