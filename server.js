// Fetch the site configuration
var fs = require('fs');
var moment = require('moment');
var slashes = require('slashes');
var url = require('url');

convertToString = function(str) {
    return "'" + slashes.add(str) + "'";
}
try {
    const browserDataArray = JSON.parse(fs.readFileSync('history.json', 'utf8'));
    const tempFilepathStream = fs.createWriteStream("history.arff");
    uniqueDomains = [];
    hostNameMap={};

    browserDataArray.forEach(function(browserData, index) {
      let parsedDataTemp = url.parse(browserData["url"])
      const hostname1 = parsedDataTemp.hostname;
      if(hostNameMap[hostname1]){
        hostNameMap[hostname1]=  ++hostNameMap[hostname1];
      }else{
        hostNameMap[hostname1]=1;
      }
    })
    browserDataArray.forEach(function(browserData, index) {
        const keys = Object.keys(browserData);
        const data = [];
          let parsedDataTemp = url.parse(browserData["url"])
        const hostname1 = parsedDataTemp.hostname;
        let mappedLinks=["pay.airtel.in","infinity.icicibank.com","www.citibank.co.in","www.online.citibank.co.in"]

        if(hostNameMap[hostname1]>40){
          keys.forEach(function(key, keyIndex) {
                  switch (key) {
                      case "lastVisitTime":
                      let dateOftheWeek=moment(new Date(browserData[key]));
                          data.push(convertToString(dateOftheWeek.format('dddd')));
                          data.push((dateOftheWeek.format('HH')));
                              data.push((dateOftheWeek.format('DD')));
                              data.push((dateOftheWeek.format('MM')));
                              data.push((dateOftheWeek.format('WW')%4));



                          break;
                      case "title":
                          break;
                      case "url":
                          let parsedData = url.parse(browserData[key])
                          const hostname = parsedData.hostname;
                          if (uniqueDomains.indexOf(hostname) == -1) {
                              uniqueDomains.push(hostname);
                          }

                          data.push(convertToString(parsedData.hostname));

                          break;
                      default:

                  }

          })
          tempFilepathStream.write(data.join() + "\n");

        }



    });
    console.log(JSON.stringify(uniqueDomains));
    tempFilepathStream.end();
} catch (e) {
    console.log('Error:', e.stack);
}
