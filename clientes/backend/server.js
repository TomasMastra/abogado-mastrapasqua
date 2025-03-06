const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a SQL Server con autenticación SQL
const dbConfig = {
    user: 'userMastrapasqua',         // Usuario de SQL Server
    password: '1503',  // Contraseña de SQL Server
    server: 'DESKTOP-Q9JTH4D', // Nombre del servidor
    database: 'ABOGACIA',      // Nombre de la base de datos
    options: {
        encrypt: true,          // Necesario para conexiones seguras
        trustServerCertificate: true  // Evita problemas con certificados SSL
    }
};

// Conectar a SQL Server
sql.connect(dbConfig)
    .then(pool => {
        // Ruta de prueba para ver si la API funciona
        app.get("/", (req, res) => {
            res.send("API funcionando correctamente.");
        });

        // Ruta para obtener todos los usuarios
        app.get("/usuarios", (req, res) => {
            pool.request()
                .query("SELECT * FROM usuarios")  // Consulta SQL
                .then(result => {
                    res.json(result.recordset);  // Devuelve los resultados
                })
                .catch(err => {
                    res.status(500).send(err);  // En caso de error, devuelve 500
                });
        });

        // Ruta para obtener clientes
        app.get("/clientes", (req, res) => {
            pool.request()
                .query("SELECT * FROM clientes")  // Consulta SQL para los clientes
                .then(result => {
                    res.json(result.recordset);  // Devuelve los resultados
                })
                .catch(err => {
                    res.status(500).send(err);  // En caso de error, devuelve 500
                });
        });

        // Ruta para obtener expedientes
        app.get("/expedientes", async (req, res) => {
            try {
                const result = await pool.request().query("SELECT * FROM expedientes");
                res.json(result.recordset);
            } catch (err) {
                console.error("Error al obtener expedientes:", err);
                res.status(500).send(err);
            }
        });

        // Ruta para buscar clientes
        app.get('/clientes/buscar', async (req, res) => {
            const texto = req.query.texto;  // Obtener el parámetro 'texto' de la URL
            
            try {
              const result = await pool.request()
                .input('texto', sql.NVarChar, `%${texto}%`)
                .query("SELECT * FROM clientes WHERE nombre LIKE @texto OR apellido LIKE @texto");
          
              res.json(result.recordset);  // Retornar los clientes encontrados
            } catch (err) {
              console.error('Error al ejecutar la consulta:', err);
              return res.status(500).send('Error al obtener clientes');
            }
          });


          app.post('/clientes/agregar', async (req, res) => {
            try {
              const { nombre, apellido, dni, telefono, direccion, fecha_nacimiento, email } = req.body;
          
              if (!nombre || !apellido || !dni || !email) {
                return res.status(400).json({
                  error: 'Faltan campos obligatorios',
                  camposRequeridos: ['nombre', 'apellido', 'dni', 'email']
                });
              }
          
              const result = await pool.request()
                .input('nombre', sql.NVarChar, nombre)
                .input('apellido', sql.NVarChar, apellido)
                .input('dni', sql.Int, dni)
                .input('telefono', sql.NVarChar, telefono)
                .input('direccion', sql.NVarChar, direccion)
                .input('fecha_nacimiento', sql.DateTime, fecha_nacimiento)
                .input('email', sql.NVarChar, email)
                .query(`
                  INSERT INTO clientes (nombre, apellido, dni, telefono, direccion, fecha_nacimiento, email)
                  OUTPUT INSERTED.id  -- Esto devuelve el id del nuevo cliente insertado
                  VALUES (@nombre, @apellido, @dni, @telefono, @direccion, @fecha_nacimiento, @email)
                `);
          
              // El id del cliente insertado estará en result.recordset[0].id
              res.status(201).json({
                message: 'Cliente agregado exitosamente',
                id: result.recordset[0].id
              });
          
            } catch (err) {
              console.error('Error al agregar cliente:', err.message);
              console.error('Error details:', err);
              res.status(500).json({
                error: 'Error al agregar cliente',
                message: err.message
              });
            }
          });

          /* MODIFICAR */
          app.put('/clientes/modificar/:id', async (req, res) => {
            const { id } = req.params;
            const nuevosDatos = req.body; // Aquí están los datos del cliente
            
            console.log('ID del cliente a modificar:', id);
            console.log('Nuevos datos recibidos:', nuevosDatos); // 🔹 CORRECCIÓN AQUÍ
        
            try {
                const resultado = await pool.request()
                    .input('id', sql.Int, id)
                    .input('nombre', sql.NVarChar, nuevosDatos.nombre)
                    .input('apellido', sql.NVarChar, nuevosDatos.apellido)
                    .input('email', sql.NVarChar, nuevosDatos.email)
                    .input('telefono', sql.NVarChar, nuevosDatos.telefono)
                    .input('fecha_nacimiento', sql.DateTime, nuevosDatos.fecha_nacimiento)
                    .input('dni', sql.Int, nuevosDatos.dni)
                    .query(`
                        UPDATE Clientes
                        SET nombre = @nombre,
                            apellido = @apellido,
                            email = @email,
                            telefono = @telefono,
                            fecha_nacimiento = @fecha_nacimiento,
                            dni = @dni
                        WHERE id = @id
                    `);
        
                if (resultado.rowsAffected[0] > 0) {
                    res.status(200).json({ mensaje: 'Cliente actualizado correctamente' });
                } else {
                    res.status(404).json({ mensaje: 'Cliente no encontrado' });
                }
            } catch (error) {
                console.error('Error al actualizar cliente:', error);
                res.status(500).json({ mensaje: 'Error al actualizar cliente' });
            }
        });
///////////////////////////////////
      app.get('/expedientes/clientesPorExpediente/:id_expediente', async (req, res) => {
        const { id_expediente } = req.params;
        try {
            const result = await pool.request()
                .input('id_expediente', sql.Int, id_expediente)
                .query(`
                    SELECT c.*
                    FROM clientes c
                    JOIN clientes_expedientes ce ON c.id = ce.id_cliente
                    WHERE ce.id_expediente = @id_expediente
                `);

            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener clientes del expediente' });
        }
      });





      app.post('/expedientes/agregar', async (req, res) => {
        try {
          const { titulo, descripcion} = req.body;
      
          if (!titulo) {
            return res.status(400).json({
              error: 'Faltan campos obligatorios',
              camposRequeridos: ['nombre', 'apellido', 'dni', 'email']
            });
          }
      
          const result = await pool.request()
          .input('titulo', sql.NVarChar, titulo)
          .input('descripcion', sql.NVarChar, descripcion)
          .query(`
            INSERT INTO expedientes (titulo, descripcion, fecha_creacion)
            OUTPUT INSERTED.id  
            VALUES (@titulo, @descripcion, GETDATE())  -- Utiliza GETDATE() para la fecha actual
          `);
      
          // El id del cliente insertado estará en result.recordset[0].id
          res.status(201).json({
            message: 'Expediente agregado exitosamente',
            id: result.recordset[0].id
          });
      
        } catch (err) {
          console.error('Error al agregar expediente:', err.message);
          console.error('Error details:', err);
          res.status(500).json({
            error: 'Error al agregar expediente',
            message: err.message
          });
        }
      });

      /*MODIFICAR EXPEDIENTE */
      app.put('/expedientes/modificar/:id', async (req, res) => {
        const { id } = req.params;
        const nuevosDatos = req.body; // Aquí están los datos del expediente
        
        console.log('ID del expediente a modificar:', id);
        console.log('Nuevos datos recibidos:', nuevosDatos); 
      
        try {
          const resultado = await pool.request()
            .input('id', sql.Int, id)  // Debes asegurar que el ID esté en la consulta
            .input('titulo', sql.NVarChar, nuevosDatos.titulo) // Cambié esto a sql.NVarChar si el título es texto
            .input('descripcion', sql.NVarChar, nuevosDatos.descripcion)
            .query(`
              UPDATE expedientes
              SET titulo = @titulo,
                  descripcion = @descripcion
              WHERE id = @id
            `);
      
          if (resultado.rowsAffected[0] > 0) {
            res.status(200).json({ mensaje: 'Expediente actualizado correctamente' });
          } else {
            res.status(404).json({ mensaje: 'Expediente no encontrado' });
          }
        } catch (error) {
          console.error('Error al actualizar expediente:', error);
          res.status(500).json({ mensaje: 'Error al actualizar expediente' });
        }
      });
      
        
          
             // Iniciar el servidor
             app.listen(3000, () => {
              console.log("Servidor corriendo en http://localhost:3000");
          });     

    })
    .catch(err => {
        console.error("Error conectando a SQL Server:", err);  
    });
