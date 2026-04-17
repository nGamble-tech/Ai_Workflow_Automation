//Server starter

import { json } from "express";
import app from "./app.js";


const PORT = process.env.PORT || 3232;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});