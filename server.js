const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/update-mouse-position', (req, res) => {
    const { mouseX, mouseY } = req.body;

    const filePath = 'src/assets/levels/level_1.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ error: 'Error reading JSON file', details: err.message });
            return;
        }

        try {
            const json = JSON.parse(data);
            json.line.push({ x: mouseX, y: mouseY });

            fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to JSON file:', err);
                    res.status(500).json({ error: 'Error writing to JSON file', details: err.message });
                } else {
                    res.json({ message: 'Mouse position added to JSON file' });
                }
            });
        } catch (err) {
            console.error('Error parsing JSON file:', err);
            res.status(500).json({ error: 'Error parsing JSON file', details: err.message });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});