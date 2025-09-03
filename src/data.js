import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1WGRp1tMDWgFI_mN_eFCUfoe1jGq1MGrDICD-_9YCMGDqR4RgU26ITcjK1ksUjy2zeDMVyip1yCvn/pub?gid=0&single=true&output=csv"

export default function getData() {
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      return {
        id: index,
        timelineEvent: {
          title: row.title,
          summary: row.summary,
          pdfs: [
            [row.link_to_pdf, row.name_of_pdf, row.citation_information],
          ],
        },
        associated_agreement: row.associated_agreement,
        associated_agreements_list: row.associated_agreement
          ? row.associated_agreement.split(";").map(s => s.trim()).filter(Boolean)
          : [],
        names: parseNames(row.names),
        type: row.type_of_resource,
        life_cycle_phase: row.life_cycle_phase,
        date_string: row.date,
        date: "",
        content_tags: row.content_tags ? row.content_tags.split(";").map(tag => tag.trim()) : [],
      }
    })
    console.log(data)

    const name_list = createAndAssignNames(data)

    const type = formatType(data)

    const associated_agreements = formatAssociatedAgreements(data)

    const dates = createAndAssignDateObjects(data)

    const years = createYearList(data)

    const life_cycle_phase = [...new Set(data.map((el) => el.life_cycle_phase))].filter(Boolean);

    const content_tags = getAllContentTags(data)

    return {
      data: data,
      associated_agreements: associated_agreements,
      dates: dates,
      name_list: name_list,
      type: type,
      years: years,
      life_cycle_phase: life_cycle_phase,
      content_tags: content_tags
    };
  });
  return dataPromise;
}

function getAllContentTags(data) {
  // Create a Map to store unique tags (case-insensitive)
  const tagMap = new Map()

  // Iterate through each item in the data
  data.forEach(item => {
    // Ensure content_tags is an array before proceeding
    if (Array.isArray(item.content_tags)) {
      // Process each tag
      item.content_tags.forEach(tag => {
        // Only add non-empty tags
        if (tag && typeof tag === 'string') {
          const trimmedTag = tag.trim()
          const lowerTag = trimmedTag.toLowerCase()
          // If the tag doesn't exist (case-insensitive), add it
          // If it exists, keep the version with the preferred capitalization
          if (!tagMap.has(lowerTag) || trimmedTag.length > tagMap.get(lowerTag).length) {
            tagMap.set(lowerTag, trimmedTag)
          }
        }
      })
    }
  })

  // Convert the Map values to an array and sort it alphabetically
  return Array.from(tagMap.values()).sort((a, b) => a.localeCompare(b))
}


function parseNames(namesString) {
  if (!namesString || namesString.trim() === '') {
    return [{ name: '', title: '' }];
  }
  return namesString.split(";").map(person => {
    person = person.trim();
    const firstCommaIndex = person.indexOf(',');
    if (firstCommaIndex === -1) {
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

function extractDatesFromString(str) {
  if (!str) return [];
  // split on semicolons/newlines first
  const pieces = String(str).split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
  const out = [];

  const pushIfValid = (d) => { if (d instanceof Date && !isNaN(d)) out.push(d); };

  for (const p of pieces) {
    // Range like "05/18/2010 - 05/19/2010"
    const range = p.split(/\s*-\s*/).map(s => s.trim()).filter(Boolean);
    if (range.length === 2) {
      for (const side of range) {
        // recurse per side (it might be mm/dd/yyyy or m/yyyy)
        extractDatesFromString(side).forEach(pushIfValid);
      }
      continue;
    }

    // mm/dd/yyyy
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(p)) {
      const [m, d, y] = p.split("/").map(Number);
      pushIfValid(new Date(y, m - 1, d));
      continue;
    }

    // m/yyyy
    if (/^\d{1,2}\/\d{4}$/.test(p)) {
      const [m, y] = p.split("/").map(Number);
      pushIfValid(new Date(y, m - 1, 1)); // first of month
      continue;
    }

    // yyyy
    if (/^\d{4}$/.test(p)) {
      const y = Number(p);
      pushIfValid(new Date(y, 0, 1)); // Jan 1
      continue;
    }

    // last resort: let Date try
    const d = new Date(p);
    if (!isNaN(d)) pushIfValid(d);
  }

  return out;
}

function createAndAssignDateObjects(array) {
  const allDates = [];

  for (let i = 0; i < array.length; i++) {
    const raw = array[i].date_string;
    const dates = extractDatesFromString(raw);

    // store useful fields on each row
    array[i].dates = dates; // array of Dates (may be empty)
    array[i].date_min = dates.length ? new Date(Math.min(...dates)) : null;
    array[i].date_max = dates.length ? new Date(Math.max(...dates)) : null;

    // keep original 'date' for backward compatibility (use min)
    array[i].date = array[i].date_min;

    // collect for picker bounds
    allDates.push(...dates);
  }

  // Return a de-duplicated, sorted list of Dates for the DatePicker
  const uniq = Array.from(new Set(allDates.map(d => d.getTime()))).map(t => new Date(t));
  uniq.sort((a, b) => a - b);
  return uniq;
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


// data.js — replace the whole function
function formatAssociatedAgreements(array) {
  const set = new Set();
  array.forEach(row => {
    (row.associated_agreements_list || []).forEach(a => set.add(a));
  });
  return [...set].sort((a, b) => a.localeCompare(b));
}
