const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// Utility function to transform class names and specs
const transformToApiFormat = (input) => {
  return input.toLowerCase().replace(/\s+/g, "-");
};

exports.metaFunction = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { className, classSpec } = req.body;

  try {
    const url = `https://wowmeta.com/guides/mythic-plus/${transformToApiFormat(
      className
    )}/${transformToApiFormat(classSpec)}`;

    console.log("Scraping URL:", url);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the content to load
    await page.waitForSelector("table");

    const content = await page.content();
    const $ = cheerio.load(content);

    const enchantSlots = [
      "Back",
      "Chest",
      "Wrist",
      "Belt",
      "Feet",
      "Ring",
      "Weapon",
    ];

    const enchants = enchantSlots
      .map((slot) => {
        const rows = $(`tr:contains("${slot} Enchant")`);
        let bestEnchant = null;
        let highestPopularity = -1;

        rows.each((_, element) => {
          const row = $(element);
          const nameElement = row.find("a.wowheadLink");
          const name = nameElement.text().trim();
          const href = nameElement.attr("href");
          const popularityText = row
            .find("td:last-child div:first-child")
            .text()
            .trim();
          const popularity = parseInt(popularityText) || 0;

          if (popularity > highestPopularity) {
            const iconElement = row.find("span.iconlarge ins");
            const backgroundImage = iconElement.css("background-image");
            const iconUrl = backgroundImage
              ? backgroundImage.replace(/^url$['"]?/, "").replace(/['"]?$$/, "")
              : "https://wow.zamimg.com/images/wow/icons/large/inv_misc_enchantedscroll.jpg";

            bestEnchant = {
              slot: `${slot} Enchant`,
              name,
              href,
              popularity: `${popularity}%`,
              iconUrl,
            };
            highestPopularity = popularity;
          }
        });

        console.log(`Best enchant for ${slot}:`, bestEnchant);
        return bestEnchant;
      })
      .filter((enchant) => enchant !== null);

    await browser.close();

    console.log("Final enchants data:", JSON.stringify(enchants, null, 2));

    res.status(200).json({ enchants });
  } catch (error) {
    console.error("Error scraping enchant data:", error);
    res.status(500).json({ error: "Failed to scrape enchant data" });
  }
};
