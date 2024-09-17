const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'natacion'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});


app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/cargar-carrera', (req, res) => {
    const { carrera, fecha } = req.body;

    const query = 'INSERT INTO carreras (carrera, fecha) VALUES (?, ?)';
    connection.query(query, [JSON.stringify(carrera), fecha], (err, results) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al cargar los datos de la carrera.');
            return;
        }
        res.send('Datos de la carrera cargados correctamente.');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
