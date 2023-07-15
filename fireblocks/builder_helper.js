const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const iconsDir = "dist/bootstrap-icons/icons";
const bootstrapCSSDir = "dist/bootstrap/css";
const tabulatorCSSDir = "dist/tabulator-tables/css";

// Remove all icons that we don't need (they don't contain clipboard or trash)
function removeIcons() {
  const iconsPath = path.join(__dirname, iconsDir);

  fs.readdir(iconsPath, (err, files) => {
    if (err) {
      console.error("Error reading icons directory:", err);
      return;
    }

    const keywords = ["clipboard", "trash"];
    const iconsToRemove = files.filter((icon) => {
      return !keywords.some((keyword) => icon.includes(keyword));
    });

    iconsToRemove.forEach((icon) => {
      const iconPath = path.join(iconsPath, icon);
      rimraf.sync(iconPath);
    });

    console.log("Removed icons:", iconsToRemove);
  });
}

// Remove all bootstrap css files except bootstrap.min.css
function removeBootstrapCSS() {
  const cssPath = path.join(__dirname, bootstrapCSSDir);

  fs.readdir(cssPath, (err, files) => {
    if (err) {
      console.error("Error reading css directory:", err);
      return;
    }

    const cssToRemove = files.filter((css) => {
      return !css.includes("bootstrap.min.css");
    });

    cssToRemove.forEach((css) => {
      const cssFilePath = path.join(cssPath, css);
      rimraf.sync(cssFilePath);
    });

    console.log("Removed css:", cssToRemove);
  });
}

// removes all tabulator css except for tabulator.min.css and tabulator_semanticui.min.css
function removeTabulatorCSS() {
  const cssPath = path.join(__dirname, tabulatorCSSDir);

  fs.readdir(cssPath, (err, files) => {
    if (err) {
      console.error("Error reading css directory:", err);
      return;
    }

    const cssToRemove = files.filter((css) => {
      return !css.includes("tabulator.min.css") && !css.includes("tabulator_semanticui.min.css");
    });

    cssToRemove.forEach((css) => {
      const cssFilePath = path.join(cssPath, css);
      rimraf.sync(cssFilePath);
    });

    console.log("Removed css:", cssToRemove);
  });
}

removeIcons();
removeBootstrapCSS();
removeTabulatorCSS();