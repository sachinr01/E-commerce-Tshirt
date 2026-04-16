const db = require("../config/db");

// GET ALL CATEGORIES
exports.index = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM tbl_categories ORDER BY id DESC"
  );

  res.render("category/index", {
    title: "Categories",
    categories: rows,
    admin: req.session.admin,
  });
};

// ADD CATEGORY
exports.store = async (req, res) => {
  const { name, slug, parent_id, description } = req.body;

  const finalSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  await db.query(
    `INSERT INTO tbl_categories (name, slug, parent_id, description)
     VALUES (?, ?, ?, ?)`,
    [name, finalSlug, parent_id || 0, description || ""]
  );

  res.render("category/index"); // ✅ Fixed: absolute path
};

// UPDATE CATEGORY
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, slug, parent_id, description } = req.body;

  const finalSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  await db.query(
    `UPDATE tbl_categories 
     SET name=?, slug=?, parent_id=?, description=? 
     WHERE id=?`,
    [name, finalSlug, parent_id || 0, description || "", id]
  );

   res.render("category/index"); // ✅ Fixed: absolute path
};

// DELETE CATEGORY
exports.delete = async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM tbl_categories WHERE id=?", [id]);

   res.render("category/index"); // ✅ Fixed: absolute path
};