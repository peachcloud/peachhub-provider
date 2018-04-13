module.exports = Jobs

const jobCreators = {

}
  
function Jobs (config) {
  return Object.keys(jobCreators)
    .reduce(
      (sofar, key) => {
        sofar[key] = jobCreators[key](config)
        return sofar
      },
      {}
    )
}
