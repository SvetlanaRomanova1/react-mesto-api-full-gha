const { PORT = 3000, JWT_SECRET = 'DEV_JWT' } = process.env;
console.log(PORT)

module.exports = {
  PORT,
  JWT_SECRET,
};
