const fs = require("fs")
const path = require("path")

// Path to .babelrc
const babelrcPath = path.join(process.cwd(), ".babelrc")

// Check if .babelrc exists
if (fs.existsSync(babelrcPath)) {
  console.log("Removing .babelrc file...")
  try {
    fs.unlinkSync(babelrcPath)
    console.log(".babelrc file removed successfully.")
  } catch (error) {
    console.error("Error removing .babelrc file:", error)
  }
} else {
  console.log(".babelrc file does not exist.")
}
