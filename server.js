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
    browserDataArray.forEach(function(browserData, index) {
        const keys = Object.keys(browserData);
        const data = [];
            keys.forEach(function(key, keyIndex) {
                    switch (key) {
                        case "lastVisitTime":
                        let dateOftheWeek=moment(new Date(browserData[key]));
                            data.push(convertToString(dateOftheWeek.format('dddd')));

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

    });
    console.log(JSON.stringify(uniqueDomains));
    tempFilepathStream.end();
} catch (e) {
    console.log('Error:', e.stack);
}
