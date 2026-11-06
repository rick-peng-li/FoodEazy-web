require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/register");
const Product = require("../models/product");

const mongoURL =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodeazy";

const images = [
  "/images/productImage-1598290103896-821019517.jpg",
  "/images/productImage-1598290116053-614118570.jpg",
  "/images/productImage-1598290127103-668259691.jpg",
];

const dishes = [
  { name: "Margherita Pizza", price: 299, type: "Veg" },
  { name: "Farmhouse Pizza", price: 399, type: "Veg" },
  { name: "Paneer Tikka", price: 249, type: "Veg" },
  { name: "Veg Biryani", price: 219, type: "Veg" },
  { name: "Chicken Biryani", price: 329, type: "nonVeg" },
  { name: "Chicken Nuggets", price: 199, type: "nonVeg" },
  { name: "Masala Dosa", price: 149, type: "Veg" },
  { name: "Chocolate Brownie", price: 129, type: "Veg" },
];

const accounts = [
  {
    name: "Food Eazy Admin",
    email: "admin@foodeazy.com",
    number: 9876543210,
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Demo Customer",
    email: "user@foodeazy.com",
    number: 9123456780,
    password: "User@123",
    role: "user",
  },
];

async function upsertAccount(account) {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(account.password, salt);
  let user = await User.findOne({ email: account.email });

  if (!user) {
    user = new User({
      name: account.name,
      email: account.email,
      number: account.number,
      password,
      role: account.role,
      verify: true,
      uid: "SEEDED",
    });
  } else {
    user.name = account.name;
    user.number = account.number;
    user.password = password;
    user.role = account.role;
    user.verify = true;
  }

  await user.save();
  console.log(`Account ready: ${account.email} / ${account.password}`);
}

async function seed() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  for (const account of accounts) {
    await upsertAccount(account);
  }

  for (let index = 0; index < dishes.length; index++) {
    const dish = dishes[index];
    await Product.findOneAndUpdate(
      { name: dish.name },
      { ...dish, url: images[index % images.length] },
      { upsert: true, useFindAndModify: false }
    );
  }

  console.log(`Dishes ready: ${dishes.length}`);
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
