import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7bjPhChmC2vE0mFcMOJM_I5q0gPSnHYIpTtT-OZ7OBJrZGIWbkqc-j7UW7am5kAthcZ5ONO0HpmUM/pub?gid=0&single=true&output=csv"

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
        life_cycle_phase: row.life_cycle_phase,
        date_string: row.date,
        date: "",
      }
    })

    console.log(data)
    const name_list = createAndAssignNames(data)

    const type = formatType(data)

    const associated_agreements = formatAssociatedAgreements(data)

    const dates = createAndAssignDateObjects(data)

    const years = createYearList(data)

    const life_cycle_phase = [...new Set(data.map((el) => el.life_cycle_phase))].filter(Boolean);

    return {
      data: data,
      associated_agreements: associated_agreements,
      dates: dates,
      name_list: name_list,
      type: type,
      years: years,
      life_cycle_phase: life_cycle_phase
    };
  });
  return dataPromise;
}

function parseNames(namesString) {
  return namesString.split(";").map(person => {
    person = person.trim();
    const firstCommaIndex = person.indexOf(',');
    if (firstCommaIndex === -1) {
      // No comma found, assume it's just a name without a title
      return { name: person.trim(), title: "" };
    }
    const name = person.slice(0, firstCommaIndex).trim();
    const title = person.slice(firstCommaIndex + 1).trim();
    return { name, title };
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
  let dates = [];
  let date_strings = [];

  for (let i = 0; i < array.length; i++) {
    let dateString = array[i].date_string;
    let dateObject = null;

    if (dateString && dateString.trim() !== '') {
      dateObject = new Date(dateString);
      
      // Check if the date is valid
      if (!isNaN(dateObject.getTime())) {
        array[i].date = dateObject;
        
        if (!date_strings.includes(dateString)) {
          date_strings.push(dateString);
          dates.push(dateObject);
        }
      } else {
        console.warn(`Invalid date string: ${dateString}`);
        array[i].date = null;
      }
    } else {
      console.warn(`Empty date string at index ${i}`);
      array[i].date = null;
    }
  }

  return dates.filter(date => date !== null);
}

function formatType(array) {
  let typesArray = []
  array.forEach(row => {
    if (row.type) {
      const types = row.type.split(",").map(type => type.trim())
      types.forEach(type => {
        if (type && !typesArray.includes(type)) {
          typesArray.push(type)
        }
      })
    }
  })
  // console.log(typesArray)
  return typesArray.sort((a, b) => a.localeCompare(b))
}


function formatAssociatedAgreements(array) {
  return [...new Set(array.map((el) => el.associated_agreement))]
}
