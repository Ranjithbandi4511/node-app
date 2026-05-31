const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const router = express.Router();
const COLLECTION = "users";

function parseUserBody(body) {
  const { user_name, email, password, age, city } = body;

  if (!user_name || typeof user_name !== "string") {
    return { error: "user_name is required (string)" };
  }
  if (!email || typeof email !== "string") {
    return { error: "email is required (string)" };
  }
  if (!password || typeof password !== "string") {
    return { error: "password is required (string)" };
  }
  if (age === undefined || age === null || Number.isNaN(Number(age))) {
    return { error: "age is required (number)" };
  }
  if (!city || typeof city !== "string") {
    return { error: "city is required (string)" };
  }

  return {
    user_name: user_name.trim(),
    email: email.trim(),
    password,
    age: Number(age),
    city: city.trim(),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const users = await getDb().collection(COLLECTION).find({}).toArray();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = parseUserBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const result = await getDb().collection(COLLECTION).insertOne(parsed);
    const user = await getDb()
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = parseUserBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const result = await getDb()
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: parsed },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await getDb()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
