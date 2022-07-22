const mysql = require("mysql")
const Database = new mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Bigsun Protect  ﾒ",
})

Database.connect(function(err) {

  if(err) throw err;

  console.log(` 
  ╔═════════════════════════════╗
  ║      Database connectée     ║
  ╚═════════════════════════════╝`)   
})

module.exports = Database;