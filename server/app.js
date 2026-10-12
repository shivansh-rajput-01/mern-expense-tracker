require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

const User = require("./models/user.js");
const Category = require("./models/category.js");
const Expense = require("./models/expense.js");
const Budget = require("./models/budget.js");
const BudgetCategory = require("./models/categoryBudget.js");
const createBulkData = require("./utils/BulkData.js");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main()
  .then((res) => console.log("connected to db"))
  .catch((err) => console.log(err));

function isLoggedIn(req, res, next) {
  try {
    const token = jwt.verify(req.cookies.user, process.env.JWT_SECRET);
    req.user = token;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "protected route login required",
    });
  }
}

app.get("/", (req, res) => {
  res.json({ key: "dummy data" });
});

app.post("/register", async (req, res) => {
  let { userName, email, password } = req.body;
  let u1 = await User.findOne({ username: userName });
  let u2 = await User.findOne({ email });

  if (u1 || u2) {
    // duplicate username or email
    return res.status(400).json({
      success: false,
      message: "duplicate username or email",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({
    username: userName,
    email,
    password: hash,
  });

  await user.save();

  // automatic login on register
  const token = jwt.sign({ username: userName }, process.env.JWT_SECRET);
  res.cookie("user", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "registration successful",
    username: userName,
  });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  let { userName, password } = req.body;

  const u1 = await User.findOne({ username: userName });
  if (!u1) {
    // if username does not exist
    return res.status(400).json({
      success: false,
      message: "invalid credentials",
    });
  }

  if (!(await bcrypt.compare(password, u1.password))) {
    // wrong password
    return res.status(400).json({
      success: false,
      message: "invalid credentials",
    });
  }

  // correct credentials
  const token = jwt.sign({ username: u1.username }, process.env.JWT_SECRET);
  res.cookie("user", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "login successful",
    username: u1.username,
  });
});

app.get("/me", (req, res) => {
  try {
    let token = jwt.verify(req.cookies.user, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      username: token.username,
      message: "authenticated session",
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "invalid",
    });
  }
});

app.post("/logout", isLoggedIn, (req, res) => {
  console.log("logout requested");
  res.clearCookie("user", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

app.post("/userinfo", isLoggedIn, async (req, res) => {
  console.log("userinfo", req.body);
  let { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(200).json({
      success: true,
      message: "user data sended",
      userData: {
        role: user.role,
        email: user.email,
        id: user._id.toString(),
      },
    });
  }
  return res.status(401).json({
    success: false,
    message: "wrong user info",
  });
});

app.post("/category", isLoggedIn, async (req, res) => {
  console.log("category");
  const { categorys } = req.body;
  const user = await User.findOne({ username: req.user.username });

  if (!user || (user && user.role != "admin")) {
    return res.status(400).json({
      success: false,
      message: "invalid user data",
    });
  }

  const cat = new Category({
    name: categorys,
    createdBy: user._id,
  });

  await cat.save();

  const categories = await Category.find({});

  return res.status(200).json({
    success: true,
    message: "Category Saved Successfully",
    cat: categories,
  });
});

app.get("/admindata", isLoggedIn, async (req, res) => {
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    return res.status(200).json({
      success: true,
      message: "admin provided",
      adminid: admin._id.toString(),
    });
  }
  return res.status(401).json({
    success: false,
    message: "some error occured",
  });
});

app.get("/categories", isLoggedIn, async (req, res) => {
  const { userId } = req.query;
  const admin = await User.findOne({ role: "admin" });
  let category;

  if (userId == admin._id.toString()) {
    category = await Category.find({ createdBy: userId });
  } else {
    category = await Category.find({
      $or: [{ createdBy: userId }, { createdBy: admin._id }],
    });
  }

  if (category.length) {
    return res.status(200).json({
      success: true,
      message: "category sended",
      cat: category,
    });
  }

  return res.status(400).json({
    success: false,
    message: "some error occured",
  });
});

app.post("/expense", isLoggedIn, async (req, res) => {
  let { category, description, price, date, owner } = req.body;
  const userId = await User.findOne({ username: req.user.username });
  const expense = new Expense({
    description,
    price,
    category,
    owner,
  });
  if (date) expense.date = date;

  // check if expense is dated in any budget of current user if any then link it
  const budList = await Budget.find({
    $and: [
      { start: { $lte: expense.date } },
      { end: { $gte: expense.date } },
      { owner: userId },
    ],
  });

  if (budList && budList.length) {
    // if any budget is found
    let budId = [];
    for (let b of budList) {
      budId.push(b._id);
    }
    expense.budget = budId;
  }

  await expense.save();
  return res.status(200).json({
    success: true,
    message: "expense added successfully",
  });
});

app.post("/expenses/bulk", isLoggedIn, async (req, res) => {
  console.log("request received");
  const {data} = req.body;
  const user = await User.findOne({username: req.user.username});
  if(!user) {
    return res.status(400).json({
      success: false,
      message: "invalid user"
    });
  }
  const userBudgets = await Budget.find({owner: user._id});
  const insertData = createBulkData(data, userBudgets, user._id);
  await Expense.insertMany(insertData);
  return res.status(200).json({
    success: true,
    message: "saved succesfully",
    data: insertData
  });
});

app.get("/expense", isLoggedIn, async (req, res) => {
  let { userId } = req.query;
  const expenses = await Expense.find({ owner: userId })
    .populate("category")
    .sort({ date: -1 });

  if (expenses.length) {
    return res.status(200).json({
      success: true,
      message: "expenses sended",
      exp: expenses,
    });
  }

  return res.status(400).json({
    success: false,
    message: "some error occured",
  });
});

app.delete("/category", isLoggedIn, async (req, res) => {
  const { catId } = req.query;
  console.log(catId);
  const user = await User.findOne({ username: req.user.username });
  if (user.role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "admin required for this operation",
    });
  }

  const expense = await Expense.findOne({ category: catId });
  const budget = await BudgetCategory.findOne({ category: catId });

  if (expense || budget) {
    // category already in use cannot delete it
    console.log("return undelete");
    return res.status(200).json({
      success: false,
      message: "Category in use cannot delete",
    });
  }

  const cat = await Category.findByIdAndDelete(catId);
  const admin = await User.find({ role: "admin" });

  const remCat = await Category.find({});
  if (cat) {
    return res.status(200).json({
      success: true,
      message: "deleted category",
      cat: remCat,
    });
  }

  return res.status(400).json({
    success: false,
    message: "no category found",
  });
});

app.get("/popularcategory", isLoggedIn, async (req, res) => {
  const popularCategories = await Expense.aggregate([
    {
      $group: {
        _id: "$category",
        usageCount: { $sum: 1 },
      },
    },
    {
      $sort: { usageCount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $project: {
        _id: 1,
        categoryName: "$categoryDetails.name",
        usageCount: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    catArr: popularCategories,
  });
});

app.post("/budget", isLoggedIn, async (req, res) => {
  let { name, start, end, budgetMoney, owner } = req.body;

  // check if same budget is already created by same owner
  const isSame = await Budget.findOne({
    start,
    end,
    owner,
  });

  if (isSame) {
    return res.status(200).json({
      success: false,
      message: "same duration budget already exists",
      data: isSame.name,
    });
  }

  const budgetCreated = new Budget({
    name,
    start,
    end,
    budgetMoney,
    owner,
  });

  await budgetCreated.save();

  // after creating a budget mark all expenses in that date range with this budget ref

  await Expense.updateMany(
    // finding expenses within budget duration
    {
      owner: owner,
      date: { $gte: start, $lte: end },
    },
    // update list
    {
      $push: { budget: budgetCreated._id },
    },
  );

  return res.status(200).json({
    success: true,
    message: "budget created successfully",
  });
});

app.get("/budget", isLoggedIn, async (req, res) => {
  let username = req.user.username;
  const user = await User.findOne({ username });
  const budgetList = await Budget.find({ owner: user._id }).populate(
    "budgetCategory",
  );
  return res.status(200).json({
    success: true,
    data: budgetList,
  });
});

app.get("/budget/expenses", isLoggedIn, async (req, res) => {
  const { bid } = req.query;
  const username = req.user.username;
  const user = await User.findOne({ username });

  // check whether the requested budget is owned by authenticated user or not
  const budget = await Budget.findOne({
    _id: bid,
    owner: user._id,
  }).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });

  if (!budget) {
    // authenticated user is not owner of this budget
    return res.status(200).json({
      success: false,
      message: "budget not owned by this user",
    });
  }

  const expenseList = await Expense.find({
    budget: bid,
  })
    .populate("category")
    .sort({ date: -1 });

  return res.status(200).json({
    success: true,
    message: "expenses sended",
    expenses: expenseList,
    budget: budget,
  });
});

app.post("/budget/category", isLoggedIn, async (req, res) => {
  let { bid, category, amount } = req.body;

  amount = Number(amount);

  if (amount <= 0) {
    return res.status(200).json({
      success: false,
      message: `Please enter valid budget ${amount} Rs cannot be budget`,
    });
  }

  const user = await User.findOne({ username: req.user.username });

  const budget = await Budget.findOne({
    _id: bid,
    owner: user._id,
  });

  if (!budget) {
    // this id budget is not owned by logged in user
    return res.status(400).json({
      message: "unauthorized user",
    });
  }

  // check if current amount and all previous category amounts are less than budget or exceeding
  const result = await Budget.findById(bid).populate("budgetCategory");

  console.log(result);

  let budgetAmount;
  let subCatBudgets = 0;

  if (result) {
    budgetAmount = result.budgetMoney;

    if (result.budgetCategory && result.budgetCategory.length > 0) {
      // categories exists
      subCatBudgets = result.budgetCategory.reduce(
        (acc, curr) => acc + curr.budget,
        0,
      );

      // check if requested category exists in category budgets already
      for (let cat of result.budgetCategory) {
        console.log(cat.category, category);
        if (cat.category.toString() === category.toString()) {
          // requested category already alloted in current budget
          return res.status(200).json({
            success: false,
            message:
              "You have already created sub budget for this category in current budget",
          });
        }
      }
    }
  }

  if (budgetAmount < subCatBudgets + amount) {
    return res.status(200).json({
      success: false,
      message: `Budget limit exceeded: You have ${budgetAmount.toLocaleString()} Rs budget and already divided sub budgets with amount ${subCatBudgets.toLocaleString()} Rs your remaining balance for new category is ${(budgetAmount - subCatBudgets).toLocaleString()} Rs if want to add increase your budget please`,
    });
  }

  // budget category is new for current budget and amount is valid
  const bCat = new BudgetCategory({
    category: category,
    budget: amount,
  });

  await bCat.save();

  const nB = await Budget.findByIdAndUpdate(
    bid,
    {
      $push: {
        budgetCategory: bCat._id,
      },
    },
    {
      new: true,
    },
  ).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });

  return res.status(200).json({
    success: true,
    message: "save successfully",
    budget: nB,
  });
});

app.delete("/budget/category", isLoggedIn, async (req, res) => {
  const { bid, delModal } = req.query;
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  let budget = await Budget.findOne({
    owner: user._id,
    _id: bid,
    budgetCategory: delModal,
  });
  if (!budget) {
    // bid is not owned by logged in user
    return res.status(400).json({
      success: false,
      message: "user not authorized",
    });
  }
  await Budget.findByIdAndUpdate(bid, {
    $pull: {
      budgetCategory: delModal,
    },
  });
  await BudgetCategory.findByIdAndDelete(delModal);
  budget = await Budget.findById(bid).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });
  return res.status(200).json({
    success: true,
    message: "deleted successfully",
    newList: budget,
  });
});

app.put("/budget/category", isLoggedIn, async (req, res) => {
  const { bid } = req.query;
  const { id, budget } = req.body;
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  let budget1 = await Budget.findOne({
    owner: user._id,
    _id: bid,
    budgetCategory: id,
  }).populate("budgetCategory");
  if (!budget1) {
    // bid is not owned by logged in user
    return res.status(400).json({
      success: false,
      message: "user not authorized",
    });
  }

  const catBud = await BudgetCategory.findById(id);
  let prevSum = 0;
  let budgetAmount = budget1.budgetMoney;
  for (let ele of budget1.budgetCategory) {
    prevSum += ele.budget;
  }
  let newSum = prevSum + Number(budget) - catBud.budget; // new category sum is previous sum + current new value - old value
  if (newSum > budgetAmount) {
    return res.status(200).json({
      success: false,
      message: `Your total budget is ₹${budgetAmount.toLocaleString()} and after this edit category budget will sum upto ₹${newSum.toLocaleString()} which is greater than allocated budget. You can edit it to maximum of ₹${(budgetAmount - (prevSum - catBud.budget)).toLocaleString()}`,
    });
  }

  await BudgetCategory.findByIdAndUpdate(id, {
    budget: budget,
  });
  let newBudget = await Budget.findById(bid).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });
  return res.status(200).json({
    success: true,
    message: "edited successfully",
    budget: newBudget,
  });
});

app.put("/budget", isLoggedIn, async (req, res) => {
  const { newBudget } = req.body;
  const { id } = req.query;

  const user = await User.findOne({ username: req.user.username });

  if (user) {
    const budget = await Budget.findOne({
      _id: id,
      owner: user._id,
    });
    if (!budget) {
      return res.status(400).json({
        success: false,
        message: "not authorized",
      });
    }
  }

  const populatedBudget = await Budget.findById(id).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });

  let subAmount = 0;

  if (
    populatedBudget.budgetCategory &&
    populatedBudget.budgetCategory.length > 0
  ) {
    for (let bCat of populatedBudget.budgetCategory) {
      subAmount += bCat.budget;
    }
  }

  if (newBudget < subAmount) {
    // new budget is less than aggregate of category budget sum
    return res.status(200).json({
      success: false,
      message: `category budget ${subAmount.toLocaleString()} Rs exceeds your entered budget ${newBudget.toLocaleString()} Rs budget should be greater than category budget sum`,
    });
  }

  const budget = await Budget.findByIdAndUpdate(id, {
    budgetMoney: newBudget,
  }).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });

  return res.status(200).json({
    success: true,
    message: "updated successfully",
    budget: { ...budget.toObject(), budgetMoney: newBudget },
  });
});

app.delete("/expense", isLoggedIn, async (req, res) => {
  const { eid } = req.query;
  const user = await User.findOne({ username: req.user.username });
  if (user) {
    let expense = await Expense.findOne({
      _id: eid,
      owner: user._id,
    });
    if (!expense) {
      return res.status(400).json({
        success: false,
        message: "user not authorized",
      });
    }
    let exp = await Expense.findByIdAndDelete(eid);
    let expList = await Expense.find({ owner: user._id })
      .populate("category")
      .sort({ date: -1 });
    return res.status(200).json({
      success: true,
      message: "deleted successfully",
      data: expList,
    });
  }
  return res.status(400).json({
    success: false,
    message: "no user found",
  });
});

app.put("/expense", isLoggedIn, async (req, res) => {
  const { id, description, price, category } = req.body;
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }

  const expense = await Expense.findOne({
    _id: id,
    owner: user._id,
  });

  if (!expense) {
    return res.status(400).json({
      success: false,
      message: "user not authorized",
    });
  }

  await Expense.findByIdAndUpdate(id, {
    description,
    price,
    category,
  });

  const newList = await Expense.find({ owner: user._id })
    .populate("category")
    .sort({ date: -1 });

  return res.status(200).json({
    success: true,
    message: "edited successfully",
    data: newList,
  });
});

app.get("/analysis", isLoggedIn, async (req, res) => {
  const username = req.user.username;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  const expList = await Expense.find({
    owner: user._id,
  })
    .populate("category")
    .sort({ date: -1 })
    .limit(10);

  const budgetNumber = await Budget.find({
    owner: user._id,
  });

  let currDate = new Date();

  let threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currDate.getMonth() - 3);

  const lastThreeMonthsExpenses = await Expense.find({
    owner: user._id,
    date: {
      $lte: currDate,
      $gte: threeMonthsAgo,
    },
  }).populate("category");

  return res.status(200).json({
    success: true,
    numberOfBudgets: budgetNumber.length,
    lastTenExpense: expList,
    lastThreeMonthsExpenses: lastThreeMonthsExpenses,
  });
});

app.get("/budget/import", isLoggedIn, async (req, res) => {
  const { bName } = req.query;
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "invalid user",
    });
  }

  const budget = await Budget.find({
    owner: user._id,
    name: bName,
  })
    .collation({ locale: "en", strength: 2 })
    .populate({
      path: "budgetCategory",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  return res.status(200).json({
    success: true,
    message: "data sended successfully",
    budget: budget,
  });
});

app.post("/budget/category/bulk", isLoggedIn, async (req, res) => {
  let { bid } = req.query;
  let { override, elements, remove } = req.body;
  if (elements?.length === 0) {
    return res.status(200).json({
      success: false,
      message: "sended empty record",
    });
  }
  console.log(override);
  console.log(elements);
  console.log(remove);
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  const budget = await Budget.findOne({
    _id: bid,
    owner: user._id,
  });
  if (!budget) {
    return res.status(400).json({
      success: false,
      message: "user not authorized",
    });
  }
  if (!override) {
    // insert only
    const insertedCategories = await BudgetCategory.insertMany(elements);
    const categoryIds = insertedCategories.map((cat) => cat._id);
    const updatedBudget = await Budget.findByIdAndUpdate(
      bid,
      { $push: { budgetCategory: { $each: categoryIds } } },
      { new: true },
    );
  } else if (override) {
    let removeIds = remove.map((el) => el.id);
    await BudgetCategory.deleteMany({
      _id: { $in: removeIds },
    });
    await Budget.findByIdAndUpdate(bid, {
      $pull: { budgetCategory: { $in: removeIds } },
    });
    const insertedCategories = await BudgetCategory.insertMany(elements);
    const categoryIds = insertedCategories.map((cat) => cat._id);
    const updatedBudget = await Budget.findByIdAndUpdate(
      bid,
      { $push: { budgetCategory: { $each: categoryIds } } },
      { new: true },
    );
  }
  const newBudget = await Budget.findById(bid).populate({
    path: "budgetCategory",
    populate: {
      path: "category",
      model: "Category",
    },
  });
  return res.status(200).json({
    success: true,
    message: "imported successfully",
    budget: newBudget,
  });
});

app.put("/userdata", isLoggedIn, async (req, res) => {
  const { username, email } = req.body;
  console.log(username, email);
  const user = await User.findOneAndUpdate(
    {
      username: req.user.username,
    },
    {
      username: username,
      email: email,
    },
  );
  if(!user) {
    return res.status(400).json({
        success: false,
        message: "something went wrong"
    });
  }
  const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
  res.cookie("user", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    message: "updated successfully",
    username: username,
    userData: {
        role: user.role,
        id: user._id,
        email: email
    }
  })
});

app.put("/password", isLoggedIn, async (req, res) => {
    const {oldPass, newPass} = req.body;
    const user = await User.findOne({username: req.user.username});
    if(!user) {
        return res.status(400).json({
            success: false,
            message: "something went wrong"
        });
    }
    if (!await bcrypt.compare(oldPass, user.password)) {
        return res.status(200).json({
            success: false,
            message: "wrong password"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPass, salt);
    const update = await User.findByIdAndUpdate(user._id, {
        password: hash
    });
    if(!update) {
        return res.status(400).json({
            success: false,
            message: "something went wrong"
        });
    } 
    return res.status(200).json({
        success: true,
        message: "password updated successfully"
    });
});

app.listen(process.env.PORT, () => {
  console.log(`server listening to port ${process.env.PORT}`);
});
