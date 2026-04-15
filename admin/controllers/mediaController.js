const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");

// Allowed image extensions
const allowedExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// Recursive function
function getImages(dir, baseUrl = "") {
  let results = [];

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(
        getImages(fullPath, baseUrl + "/" + file)
      );
    } else {
      const ext = path.extname(file).toLowerCase();
      if (allowedExt.includes(ext)) {
        results.push({
          url: baseUrl + "/" + file
        });
      }
    }
  });

  return results;
}

// GET MEDIA
exports.getMedia = (req, res) => {
  try {
    const images = getImages(PUBLIC_DIR, "");
    res.json(images);
  } catch (err) {
    console.error("Media Error:", err);
    res.json([]);
  }
};