import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIAqckiVoiz2Iy7O42GPjl9pIoyhuwEc1OD0n4tJGpVJbE0piEesDLmdXJxhFNgm3zHZn-PYDUzmAC/pub?gid=0&single=true&output=csv"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      return {
        id: index,
        timelineEvent: {
          title: row.title,
          summary: row.summary,
          pdfs: [
            [row.link_to_pdf, row.name_of_pdf],
          ],
          image_url: row.image_url,
          image_source: row.image_source,
        },
        associated_agreement: row.associated_agreement,
        names: parseNames(row.names),
        type: row.type_of_resource,
        date_string: row.date,
        date: "",
      }
    })

    const name_list = createAndAssignNames(data)

    const type = formatType(data)

    const associated_agreements = formatAssociatedAgreements(data)

    const dates = createAndAssignDateObjects(data)

    const years = createYearList(data)

    console.log(data)
    console.log(name_list)

    return {
      data: data,
      associated_agreements: associated_agreements,
      dates: dates,
      name_list: name_list,
      type: type,
      months: months,
      years: years,
    };
  });
  return dataPromise;
}

function parseNames(namesString) {
  return namesString.split(";").map(person => {
    const [name, title] = person.split(",").map(s => s.trim());
    return { name, title: title || "" };
  });
}

function createYearList(data) {
  // Create a Set to store unique years
  const uniqueYearsSet = new Set()

  // Loop through each row in the dataset
  data.forEach((row) => {
    // Extract the year from the date_string and add it to the Set
    const year = new Date(row.date_string).getFullYear()
    uniqueYearsSet.add(year)
  })

  // Convert the Set of unique years to an array and sort it
  return Array.from(uniqueYearsSet).sort((a, b) => a - b) // Numeric sort
}

function createAndAssignNames(array) {
  let nameArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].names.length > 0) {
      array[i].names.forEach(person => {
        if (person.name && !nameArray.includes(person.name)) {
          nameArray.push(person.name);
        }
      });
    }
  }
  return nameArray.sort((a, b) => a.localeCompare(b));
}


function createAndAssignDateObjects(array) {
  let dates = []
  let date_string = []

  for (let i = 0; i < array.length; i++) {
    let date = array[i].date_string

    let dateObject = new Date(date)
    array[i].date = dateObject

    if (!date_string.includes(array[i].date_string)) {
      date_string.push(array[i].date_string)
      dates.push(dateObject)
    }
  }

  return dates
}

function formatType(array) {
  return [...new Set(array.map((el) => el.type))]
}

function formatAssociatedAgreements(array) {
  return [...new Set(array.map((el) => el.associated_agreement))]
}
