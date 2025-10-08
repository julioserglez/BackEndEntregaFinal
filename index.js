require("dotenv").config();
const app = require("./src/app");

console.log('PUERTO', process.env.PORT);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
}); 