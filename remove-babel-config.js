const fs = require("fs")
const path = require("path")

// Files to check and remove
const filesToRemove = [".babelrc", ".babelrc.js", ".babelrc.json", "babel.config.js", "babel.config.json"]

// Remove each file if it exists
filesToRemove.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`Removing ${file}...`)
    fs.unlinkSync(filePath)
    console.log(`${file} removed successfully.`)
  } else {
    console.log(`${file} does not exist.`)
  }
})

console.log("All Babel configuration files have been removed.")
