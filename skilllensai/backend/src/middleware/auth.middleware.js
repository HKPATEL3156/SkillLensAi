const jwt = require("jsonwebtoken") // jwt

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] // get token

  if (!token) return res.status(401).json({ message: "no token" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // verify
    req.user = decoded // attach user
    next() // go next
  } catch {
    res.status(401).json({ message: "invalid token" })
  }
}
