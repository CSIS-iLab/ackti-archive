import * as d3Fetch from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-_ERImv22VF5VJU8oWN2g9_uQ4LzJr21zOHHtizHHYTuQJvHZHJGaJE6d1DUDifpiPGqmZL4MIbgU/pub?gid=2021316330&single=true&output=csv"

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
          summary: row.quote,
          sources: [
            [row.source_1, row.source_name_1],
            [row.source_2, row.source_name_2],
            [row.source_3, row.source_name_3],
          ],
          image_url: row.image_url,
          image_source: row.image_source,
        },
        category: row.category,
        category_name: row.category_name,
        speaker: row.speaker,
        speaker_name: "",
        type: row.type,
        date_string: row.date,
        date: "",
      }
    })

    const speaker = formatSpeaker(data)

    const speaker_name = createAndAssignSpeakerNames(data)

    const type = formatType(data)

    const categories = formatCategories(data)

    const dates = createAndAssignDateObjects(data)

    const years = createYearList(data)

    return {
      data: data,
      categories: categories,
      dates: dates,
      speaker: speaker,
      //speaker without title - for dropdown
      speaker_name: speaker_name,
      type: type,
      months: months,
      years: years,
    }
  })
  return dataPromise
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

function createAndAssignSpeakerNames(array) {
  let speaker_Name_Array = []

  for (let i = 0; i < array.length; i++) {
    let name = array[i].speaker.split(",")[0]
    if (array[i].speaker != "") {
      array[i].speaker_name = name

      if (!speaker_Name_Array.includes(name)) {
        speaker_Name_Array.push(name)
      }
    }
  }

  return speaker_Name_Array.sort((a, b) => a.localeCompare(b))
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

function formatSpeaker(array) {
  return [...new Set(array.map((el) => el.speaker))]
}

function formatType(array) {
  return [...new Set(array.map((el) => el.type))]
}

function formatCategories(array) {
  return [...new Set(array.map((el) => el.category))]
}
