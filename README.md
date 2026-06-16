
**Argendar** es una aplicación web moderna e intuitiva desarrollada en **Node.js** diseñada para optimizar la gestión del tiempo, la programación de turnos y la organización de agendas tanto para profesionales independientes como para pequeñas y medianas empresas.

El sistema permite automatizar reservas, enviar recordatorios y centralizar la gestión de clientes en una interfaz ágil, responsiva y fácil de usar.

---

## 📋 Características Principales

* **Calendario Interactivo:** Visualización dinámica por día, semana y mes con soporte para 
* **Gestión de Turnos:** Creación, edición y cancelación de citas en tiempo real.
* **Notificaciones Automáticas:** Envío de recordatorios vía Email/WhatsApp para reducir el ausentismo.
* **Panel de Clientes:** Historial de reservas, datos de contacto y notas personalizadas.
* **Control de Usuarios y Roles:** Permisos diferenciados para administradores, profesionales y clientes.
* **API RESTful:** Arquitectura limpia y escalable para integraciones de terceros.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Base de Datos:** 
* **Frontend:** HTML5, CSS3, JavaScript 
* **Autenticación:** JSON Web Tokens (JWT) y Bcrypt para encriptación de contraseñas
* **Control de Versiones:** Git y GitHub

---

## 🚀 Instalación y Configuración

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

### 1. Requisitos Previos

Asegúrate de tener instalado en tu sistema:
* [Node.js](https://nodejs.org/) (Versión 16.x o superior recomendada)
* [npm](https://www.npmjs.com/) (Viene incluido con Node.js) o [Yarn](https://yarnpkg.com/)
* Instancia de Base de Datos activa (MongoDB/PostgreSQL)

### 2. Clonar el Repositorio

git clone https://github.com/mauroezequielflores/argendar-integrador-pescar.git

# 🚀 Guía de Inicio Rápido - Ecosistema Argendar

¡Bienvenidos al equipo de desarrollo de **Argendar**! Para garantizar que los 9 desarrolladores trabajemos exactamente bajo las mismas condiciones de software (versiones de Node, dependencias y redes), utilizaremos un entorno contenedorizado con **Docker** corriendo sobre **WSL2 (Windows Subsystem for Linux)**. 

Esto elimina por completo el clásico *"en mi máquina no funciona"*. Siguiendo esta guía paso a paso, tendrás el Frontend, el Backend y la conexión a Supabase corriendo en tu computadora en menos de 20 minutos.

---

## 🛠️ 1. Requisitos e Instalaciones Necesarias

Antes de tocar el código, necesitamos instalar 4 herramientas esenciales en tu entorno Windows:

1. **WSL2 (Ubuntu):** Tu motor de Linux nativo dentro de Windows.
2. **Docker Desktop:** La herramienta que creará y gestionará nuestros contenedores.
3. **VS Code (Visual Studio Code):** Nuestro editor de código de preferencia.
4. **Windows Terminal:** La nueva consola de Windows (esencial para usar la pestaña de Ubuntu cómodamente).

---

## 📥 2. Guía de Instalación Paso a Paso

### Paso A: Activar WSL2 y Ubuntu 
https://learn.microsoft.com/es-es/windows/wsl/install
1. Abre **PowerShell** como Administrador (clic derecho ➜ Ejecutar como administrador).
2. Ejecuta el siguiente comando para instalar el subsistema de Linux por defecto:
   ```powershell
   wsl --install
   ```
3. **Reinicia tu computadora** cuando el proceso termine.
4. Al reiniciar, se abrirá una consola pidiéndote un **Username** y **Password** para tu nuevo Linux (Ubuntu). Elige los que quieras y anótalos.

### Paso B: Instalar y Configurar Docker Desktop
1. Descarga e instala [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/).
2. Durante la instalación, asegúrate de dejar marcada la opción **"Use WSL 2 instead of Hyper-V"** (viene activada por defecto).
3. Abre Docker Desktop, ve a la rueda de configuración (Settings) ➜ **General** ➜ Verifica que esté activado **"Use the WSL 2 based engine"**.
4. Ve a **Resources** ➜ **WSL Integration** ➜ Activa el interruptor para tu distribución de **Ubuntu** y haz clic en *Apply & Restart*.

### Paso C: Preparar VS Code
1. Instala la extensión oficial **WSL** (de Microsoft) dentro de tu VS Code. Esto te permitirá abrir carpetas dentro de Linux y programar de manera nativa con el rendimiento de Ubuntu.

---

## 🐳 3. Configuración y Uso de Docker (Paso a Paso)

> 🚨 **LA REGLA DE ORO DEL PROYECTO:** El repositorio de GitHub **DEBE** clonarse dentro de la terminal de Ubuntu (WSL). Si clonas el proyecto en el disco local de Windows (`C:/Users/...`), la sincronización de archivos irá extremadamente lenta y el *Hot Reload* se romperá.

### Paso 1: Clonar el proyecto en Linux
Abre tu **Windows Terminal**, selecciona la pestaña de **Ubuntu** y corre:
```bash
mkdir Proyectos
cd Proyectos
git clone -b develop [https://github.com/TU_ORGANIZACION/argendar-integrador-pescar.git](https://github.com/TU_ORGANIZACION/argendar-integrador-pescar.git)
cd argendar-integrador-pescar
```

### Paso 2: Crear tus archivos de configuración local (`.env`)
Los datos sensibles como las claves de Supabase no se suben a GitHub. Debes crear tus propios archivos locales copiando las plantillas de ejemplo que ya dejamos listas:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
*(Solicita al Administrador del proyecto las credenciales de Supabase en la nube para rellenar los archivos `.env` recién creados).*

### Paso 3: Encender el entorno con Docker Compose
Estando parado en la raíz de la carpeta `/argendar-integrador-pescar`, ejecuta el comando mágico:
```bash
docker compose up --build
```

#### ❓ ¿Qué está haciendo Docker en este paso?
* **Build**: Lee los archivos `Dockerfile.dev` de cada carpeta. Descarga la imagen oficial de **Node 22** e instala las dependencias de npm dentro de un entorno aislado.
* **Volumes (Volúmenes)**: Crea un puente en tiempo real entre tu carpeta física en WSL y el contenedor. Cualquier cambio que hagas en tu código se reflejará instantáneamente en el navegador.
* **Nodemon & Vite Watch**: El backend corre con `nodemon` y el frontend con el plugin de `Tailwind v4` sobre Vite. Ambos vigilan tus archivos para recargar en vivo sin que tengas que reiniciar nada.

Una vez que termine, verás los logs en paralelo. Abre tu navegador en Windows y entra a:
* 🌐 **Frontend (React):** `http://localhost:5173`
* 🔌 **Backend (Express API):** `http://localhost:5000`

---

## 💻 4. Flujo de Trabajo Diario: Codificar y usar Git

Trabajar con Docker no cambia la forma en que usas Git. Docker corre en el fondo y tú programas en el frente de forma nativa.

### ¿Cómo escribir código?
1. Desde tu terminal de Ubuntu en la carpeta del proyecto, escribe:
   ```bash
   code .
   ```
   *Esto abrirá VS Code conectado directamente al Linux nativo.*
2. Realiza los cambios que requiera tu tarea. Verás los resultados reflejados en el navegador al instante gracias al volumen de Docker.

### ¿Qué pasa si necesito instalar una nueva dependencia (librería)?
Si necesitas instalar un paquete de npm (por ejemplo, un validador en el backend o un set de íconos en el frontend):
1. **No lo instales nativamente en tu máquina.**
2. Agrégalo en el `package.json` correspondiente o avísale al encargado de la arquitectura.
3. Cuando bajes cambios de tus compañeros con `git pull` y veas que el `package.json` cambió, solo debes apagar Docker con `Ctrl + C` y volver a ejecutar:
   ```bash
   docker compose up --build
   ```
   *Docker detectará el cambio y reinstalará los paquetes nuevos dentro del contenedor de manera automática.*

### ¿Cómo subir tus avances a GitHub?
Cuando termines tu funcionalidad, abre otra pestaña de tu consola de **Ubuntu (WSL)** o usa la terminal integrada de VS Code y sigue el flujo clásico de Git:

```bash
# 1. Asegúrate de crear tu rama a partir de develop
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-tu-tarea

# 2. Hacer tus commits normalmente
git status
git add .
git commit -m "Feat: Se creó el componente de login con Tailwind"

# 3. Subir tu rama a GitHub
git push origin feature/nombre-de-tu-tarea
```
Una vez subida, ve al repositorio en GitHub y abre un **Pull Request (PR)** hacia la rama **`develop`** para que el equipo revise tu código. ¡A codificar!
