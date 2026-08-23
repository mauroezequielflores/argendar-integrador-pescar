# 🚀 Guía de Desarrollo Backend - Argendar

¡Hola, compañero! Si estás leyendo esto, es porque te estás sumando al desarrollo del backend de **Argendar** o querés entender cómo funciona bajo el capó. ¡Bienvenido/a al equipo! 

Esta guía está pensada para explicarte de forma sencilla, clara y sin tecnicismos innecesarios cómo está estructurado nuestro servidor de Node.js + Express, cómo viajan los datos y cómo podés probar todo en tu computadora.

---

## 🏛️ 1. La Arquitectura de 4 Capas (Con la analogía de un restaurante)

Para evitar que nuestro código sea un "plato de espagueti" donde todo está mezclado, dividimos el backend en **4 capas independientes**. 

Imaginate que nuestro backend es un **restaurante de comida rápida**:

```
[ Cliente / Postman ]
         │
         ▼  (1) Toma el pedido
   ┌───────────┐
   │  ROUTES   │  ◄── El Mozo (Camarero)
   └─────┬─────┘
         │  (2) Lleva la orden
         ▼
   ┌───────────┐
   │CONTROLLER │  ◄── El Jefe de Cocina (Chef)
   └─────┬─────┘
         │  (3) Delega la preparación
         ▼
   ┌───────────┐
   │  SERVICE  │  ◄── El Cocinero Especialista
   └─────┬─────┘
         │  (4) Busca ingredientes
         ▼
   ┌───────────┐
   │   MODEL   │  ◄── La Alacena / Proveedor
   └───────────┘
```

### 🗄️ A. Capa de Configuración (`config/`)
* **¿Qué es en el restaurante?** El administrador o las reglas del local (como las llaves de la puerta, la conexión de luz y gas).
* **¿Qué hace en el código?** Aquí inicializamos y configuramos las conexiones a servicios externos. Por ejemplo, en [`supabase.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/config/supabase.js) creamos el cliente de Supabase utilizando las llaves secretas de conexión.

### 🛣️ B. Capa de Rutas (`routes/`)
* **¿Qué es en el restaurante?** **El Mozo / Camarero**. Es quien recibe al cliente, le muestra la carta y anota el pedido.
* **¿Qué hace en el código?** Define los "caminos" (endpoints) de la API (por ejemplo, `POST /api/v1/auth/register`). Además, el mozo puede revisar rápidamente si el cliente tiene la billetera en la mano antes de tomar la orden (esto lo hacen los **Middlewares de Validación**, como comprobar que el email tenga un formato correcto antes de pasar el pedido a la cocina).
* **Archivo de referencia:** [`auth.routes.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/routes/auth.routes.js).

### 👨‍🍳 C. Capa de Controladores (`controllers/`)
* **¿Qué es en el restaurante?** **El Jefe de Cocina (Chef)**. El mozo le trae la orden de la mesa y el Chef decide qué se debe hacer, pero no corta las verduras ni cocina él mismo; prefiere delegarlo a sus cocineros especializados. Una vez terminado el plato, él lo decora y se lo devuelve al mozo para que se lo entregue al cliente.
* **¿Qué hace en el código?** Recibe la petición HTTP, extrae los datos que vienen del cliente (como el email y la contraseña), llama a los servicios necesarios para procesar la información y devuelve la respuesta HTTP final con el estado adecuado (ej: `200 OK` si todo salió bien, o `400 Bad Request` si faltaron datos).
* **Archivo de referencia:** [`auth.controller.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/controllers/auth.controller.js).

### 🍳 D. Capa de Servicios (`services/`)
* **¿Qué es en el restaurante?** **Los Cocineros Especialistas**. Cada uno tiene una tarea clara: uno es experto en pastas, otro en carnes. Ellos conocen la receta secreta, mezclan los ingredientes y hacen el trabajo pesado.
* **¿Qué hace en el código?** Contiene la **lógica de negocio**. Aquí es donde realmente procesamos los datos. Por ejemplo, comunicarse con Supabase para registrar el usuario, gestionar sesiones o encriptar datos. A esta capa no le importa si la petición viene de la web, de una app móvil o de Postman; su único trabajo es recibir datos limpios, procesarlos y devolver un resultado.
* **Archivo de referencia:** [`auth.service.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/services/auth.service.js).

> [!NOTE]
> También verás la carpeta `models/` (como [`userModel.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/models/userModel.js)). Esta capa actúa como **la alacena**, encargándose de hacer consultas específicas directamente a las tablas de la base de datos (por ejemplo, buscar un usuario por su ID).

---

## 🔄 2. El Ciclo de Vida de una Petición (Request Lifecycle)

Veamos el camino paso a paso que realiza una solicitud de registro desde que un usuario hace clic en **"Registrarse"** (o envía un botón en Postman) hasta que guardamos sus datos:

1. **El Envío:** El cliente realiza una petición HTTP del tipo `POST` a la dirección `http://localhost:5000/api/v1/auth/register` enviando un cuerpo (body) en formato JSON:
   ```json
   {
     "nombre": "Juan",
     "apellido": "Pérez",
     "email": "juan@example.com",
     "password": "secreto123"
   }
   ```
2. **La Entrada:** El archivo principal [`index.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/index.js) recibe la petición y la deriva al enrutador de autenticación [`auth.routes.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/routes/auth.routes.js).
3. **El Filtro (Middleware):** Antes de tocar la cocina, la petición pasa por el validador `validarRegistro` ([`auth.validation.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/validations/auth.validation.js)). Este chequea que la contraseña sea mayor a 6 caracteres y que el email sea válido. Si algo falla, se frena acá y le responde al cliente un error `400 Bad Request` explicando qué faltó.
4. **El Chef toma el control:** Si la validación es exitosa, el router llama al controlador `registrar` de [`auth.controller.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/controllers/auth.controller.js). Este extrae los datos usando el objeto **`req`** (abreviatura de *request* o petición, que contiene toda la información que nos mandó el cliente).
5. **El Cocinero trabaja:** El controlador llama a la función `registerUser` dentro de [`auth.service.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/services/auth.service.js).
6. **Conexión con Supabase y las variables `.env`:** El servicio utiliza el cliente de Supabase configurado con nuestras variables de entorno `.env` (`SUPABASE_URL` y `SUPABASE_ANON_KEY`).
   * *¿Qué es el archivo `.env`?* Es un archivo local secreto donde guardamos contraseñas y llaves de acceso para que no se suban públicamente a GitHub.
   * *¿Qué hace el SDK de Supabase por detrás?* Se conecta de manera segura a los servidores de Supabase en la nube para registrar al usuario en su sistema de autenticación y devuelve si el registro fue exitoso o si el email ya existía.
7. **La Respuesta:** El controlador recibe el resultado del servicio y usa el objeto **`res`** (abreviatura de *response* o respuesta) para enviarle una respuesta al cliente con un estado HTTP (ej: `201 Created` y los datos del usuario).

---

## 💻 3. Explicación conceptual del Código (Login y Registro)

Miremos brevemente cómo manejamos el flujo de datos y los errores más comunes:

### 📝 Registro (`registrar`)
En [`auth.controller.js`](file:///home/maur/argendar/argendar-integrador-pescar/backend/controllers/auth.controller.js):
```javascript
export async function registrar(req, res) {
  const { nombre, apellido, email, password } = req.body;
  try {
    const result = await registerUser({ nombre, apellido, email, password });
    return res.status(201).json({
      status: "success",
      message: "Usuario registrado con éxito.",
      data: result
    });
  } catch (error) {
    let statusCode = 500;
    let message = "Ocurrió un error interno...";
    
    // Si el servicio nos avisa que el email ya existe en la base de datos
    if (error.message.includes("already registered") || error.message.includes("User already exists")) {
      statusCode = 400; // Bad Request: error de datos del cliente
      message = "El correo electrónico ya está registrado.";
    }
    
    return res.status(statusCode).json({ status: "error", message });
  }
}
```
* **Manejo de Errores (Estados HTTP):**
  * **`201 Created`**: El recurso se creó exitosamente en la base de datos.
  * **`400 Bad Request`**: El cliente envió datos inválidos o que causan conflicto (como intentar registrar un email que ya está en uso).
  * **`500 Internal Server Error`**: Ocurrió un problema inesperado del lado del servidor (por ejemplo, si nos quedamos sin internet o falló la conexión con la base de datos).

### 🔑 Inicio de Sesión (`iniciarSesion`)
```javascript
export async function iniciarSesion(req, res) {
  const { email, password } = req.body;
  try {
    const result = await loginUser({ email, password });
    return res.status(200).json({
      status: "success",
      message: "Sesión iniciada con éxito.",
      data: result,
      accessToken: result.session?.accessToken
    });
  } catch (error) {
    let statusCode = 401; // Unauthorized
    let message = "Credenciales incorrectas o inválidas.";
    
    // Si los datos no coinciden, devolvemos un 401
    return res.status(statusCode).json({ status: "error", message });
  }
}
```
* **¿Por qué devolvemos `401 Unauthorized`?**
  * El código `401` le avisa al navegador o Postman que las credenciales (email o contraseña) no son correctas, por lo tanto, no se le permite la entrada. No revelamos específicamente si lo que falló fue el email o la contraseña por motivos de seguridad (para evitar que atacantes adivinen qué correos están registrados).

---

## 🛠️ 4. Guía para Pruebas Locales

Para probar estos endpoints en tu máquina, seguí estos pasos sencillos:

### Paso 1: Levantar el servidor
Tenemos dos formas de correr el proyecto:

#### Opción A: Con Docker (Recomendado para trabajar en equipo)
Parado en la raíz del proyecto (`/argendar-integrador-pescar`), ejecutá:
```bash
docker compose up --build
```
Esto levantará tanto el frontend en el puerto `5173` como el backend en el puerto `5000` de forma automática.

#### Opción B: Ejecución Local Directa (Sin Docker)
1. Entrá a la carpeta del backend: `cd backend`
2. Instalá las dependencias necesarias: `npm install`
3. Levantá el servidor en modo desarrollo: `npm run dev`
*(Asegurate de tener el archivo `backend/.env` configurado previamente).*

---

### Paso 2: Probar con Postman
En la raíz del proyecto vas a encontrar un archivo llamado [`auth_collection.postman_json`](file:///home/maur/argendar/argendar-integrador-pescar/auth_collection.postman_json). Esta es una colección lista para usar en Postman.

1. Abre **Postman**.
2. Haz clic en el botón **Import** (esquina superior izquierda).
3. Selecciona o arrastra el archivo `auth_collection.postman_json` de tu proyecto.
4. ¡Listo! Ya vas a tener una carpeta llamada **Argendar Auth** con tres peticiones preparadas:
   * **Registro**: Para crear nuevos usuarios.
   * **Login**: Para iniciar sesión y obtener tu `accessToken` (token de acceso).
   * **Obtener Usuario Actual (Me)**: Para verificar tus datos usando el token que obtuviste en el Login.

---

Si tenés alguna duda sobre cómo continuar o si ves algún comportamiento extraño en el código, ¡no dudes en escribir en el canal de comunicación del equipo! 🚀
