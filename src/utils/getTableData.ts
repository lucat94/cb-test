import * as cheerio from "cheerio";

export default (
  html: string,
  tableTitle: string,
  initialRowValue: any
): any[] => {
  const $ = cheerio.load(html);

  // Get table with players
  const table = $(`h3:contains(${tableTitle})`).next().children();

  // Get table header
  const headerText = $(table)
    .find("table thead th")
    .toArray()
    .map((el) => $(el).text());

  // Retrieve table rows, excluding hidden rows that do not have the same number of columns as the header
  const tableRows = $(table)
    .find("table tbody tr")
    .filter((index, element) => element.children.length === headerText.length)
    .toArray();

  return tableRows.map((row) => {
    const columns = $(row).find("td");
    const values = columns.toArray().map((el) => $(el).text());
    return values.reduce(
      (acc, element, index) => {
        if (
          headerText[index] === "Yearly Salary" ||
          headerText[index] === "Weekly Wage"
        ) {
          acc[headerText[index]] = Number(
            element.replace(/,/g, "").substring(1)
          );
        } else {
          acc[headerText[index]] = element;
        }
        return acc;
      },
      { ...initialRowValue }
    );
  });
};
