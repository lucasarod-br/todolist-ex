const express = require("express");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../utils/jwt");
const {
  addRefreshTokenToWhitelist,
  findRefreshToken,
  deleteRefreshTokenById,
  revokeTokens,
} = require("../services/authService");

const router = express.Router();
const {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
} = require("../services/userService");

const { query, validationResult, body } = require("express-validator");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 chars"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        return res.status(403).json({
          error: "Email already in use.",
          message: "Email already in use.",
        });
      }

      const user = await createUserByEmailAndPassword({ email, password });
      const { accessToken, refreshToken } = generateTokens(user);
      await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 chars"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const existingUser = await findUserByEmail(email);

      if (!existingUser) {
        return res.status(403).json({
          error: "Invalid login credentials.",
          message: "Invalid login credentials.",
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!validPassword) {
        return res.status(403).json({
          error: "Invalid login credentials.",
          message: "Invalid login credentials.",
        });
      }

      const { accessToken, refreshToken } = generateTokens(existingUser);
      await addRefreshTokenToWhitelist({
        refreshToken,
        userId: existingUser.id,
      });

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token.");
    }
    const savedRefreshToken = await findRefreshToken(refreshToken);

    if (
      !savedRefreshToken ||
      savedRefreshToken.revoked === true ||
      Date.now() >= savedRefreshToken.expireAt.getTime()
    ) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await findUserById(savedRefreshToken.userId);
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    await deleteRefreshTokenById(savedRefreshToken.id);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await addRefreshTokenToWhitelist({
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/revokeRefreshTokens", async (req, res, next) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
