const { default: axios } = require('axios')

const fs = require('fs');

let startIndex = 0
let resultsPerPage = 8000
let total_count = 1
let data = []
let nvd_api_key = ''
const headers = {
  'Authorization': `Bearer ${nvd_api_key}`,
  'Content-Type': 'application/json'
}

const nvdApiCall = () => {

  console.log('start-------')
  setTimeout(async () => {
    console.log('api call starts')
    let response = await axios.get(`https://services.nvd.nist.gov/rest/json/cpes/2.0/?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`, { headers })
    console.log('calculation started')
    total_count = response?.data?.totalResults
    response?.data?.products.forEach((product) => {
      let obj = {}
      obj['cpeName'] = product['cpe'].cpeName
      let { title } = product['cpe'].titles?.find((item) => item.lang === 'en')
      obj['product_title'] = title
      data.push(obj)
    })
    startIndex = startIndex + resultsPerPage
    console.log('calculation ended')
    
    if (startIndex < total_count) {
      nvdApiCall()
      console.log('function call done', startIndex + "  " + total_count)
    }else{
      fs.writeFile('./data/data.json', JSON.stringify(data), () => console.log('success writing to file'))
    }
  }, 10000)

}

nvdApiCall()