import { csv } from "d3-fetch"

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv"

const policyGoals = [
  "Emissions_Reduction",
  "Economic_Development",
  "Resilience",
]
const tags = [
  "Anticipating_Climate_Impacts",
  "Comprehensive_Planning_Grid_Modernization",
  "Data_Transparency_or_Visualization",
  "Electric_Vehicles",
  "Energy_Storage",
  "Environmental_Justice",
  "Innovation_and_Clusters",
  "Local-Level_Planning_or_Support",
  "Microgrids",
  "Distributed_Energy_Resources_(DERs)",
  "Technology_or_System_Standards",
  "Workforce_Development",
]

export default function getData() {
  const dataPromise = csv(URL).then(processData)
  return dataPromise
}

function processData(res) {
  const data = res.map((row, index) => transformRow(row, index))

  return {
    data,
    states: formatStates(data),
    tags: formatTags(tags),
    authority: formatUniqueValues(data, "authority"),
    resourceTypes: formatUniqueValues(data, "type_of_resource"),
    policyGoals,
  }
}

function transformRow(row, index) {
  return {
    id: index,
    policy_goals: filterByKeys(row, policyGoals),
    tags: formatTags(filterByKeys(row, tags)),
    activity: {
      title: row.title,
      description: row.description,
      link: row.URL,
    },
    state: row.state,
    state_name: row.state_name,
    authority: row.authority,
    type_of_resource: row.type_of_resource,
  }
}

function filterByKeys(row, keys) {
  return keys.filter((key) => row[key])
}

function formatTags(tagArray) {
  return tagArray.map((tag) => tag.split("_").join(" "))
}

function formatUniqueValues(data, key) {
  return [...new Set(data.map((item) => item[key]))]
}

function formatStates(data) {
  const statesMap = new Map()
  data.forEach((item) => {
    if (!statesMap.has(item.state)) {
      statesMap.set(item.state, { name: item.state_name, value: item.state })
    }
  })
  return Array.from(statesMap.values())
}
