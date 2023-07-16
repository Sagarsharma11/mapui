const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');
const {muteConsole} = require('./config.js')
const app = express();
app.use(bodyParser.json());
const {middleware} = require('./middleware.js')


// muteConsole()
// Array of 50 randomly spread lines
const lines = [];

// Generate 50 random lines
for (let i = 1; i <= 50; i++) {
    const line = {
      id: `L${i.toString().padStart(2, '0')}`,
      start: generateRandomCoordinates(),
      end: generateRandomCoordinates()
    };
    lines.push(line);
  }
// API endpoint for line intersection check
app.post('/check-intersection',middleware, (req, res) => {
    // Check for valid request body
    if (!req.body || !req.body.linestring) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    // console.log(req.body.linestring[0].line.coordinates)
    let linestr = []
    for(var i=0; i<req.body.linestring.length; i++){
        linestr.push(req.body.linestring[i].line.coordinates)
    }
    // console.log(linestr)
    console.log(lines)
    // Parse the input linestring from GeoJSON
    const linestring = turf.lineString(linestr);
    //   console.log(linestring)
    // Check if the linestring is valid
    if (!linestring) {
        return res.status(500).json({ error: 'Invalid linestring' });
    }
    // Find intersections with the lines
    const intersections = lines
        .filter(line => {
            const lineString = turf.lineString([line.start, line.end]);
            return turf.booleanCrosses(linestring, lineString);
        })
        .map(line => {
            const lineString = turf.lineString([line.start, line.end]);
            const intersection = turf.lineIntersect(linestring, lineString);
            return { id: line.id, intersection };
        });

    // Return the intersections or empty array if none found
    res.json(intersections);
});

// Start the server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

// Function to generate random coordinates
function generateRandomCoordinates() {
    const min = -180;
    const max = 180;
    const randomLng = Math.random() * (max - min) + min;
    const randomLat = Math.random() * (max - min) + min;
    return [randomLng, randomLat];
  }
