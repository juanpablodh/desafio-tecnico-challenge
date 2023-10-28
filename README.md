# 🚀​ Challenge Meli - API Juan Pablo Dominguez

Desafío técnico propuesto, implementando la solución, desarrollando una API REST en Node JS (Typescript)


## Autor
- **Juan Pablo Dominguez**
- [GitHub](https://github.com/juanpablodh)
## Requerimientos

Para la ejecución de esta aplicación, se deberá tener como requisitos las siguientes tecnologías.

### Docker
- #### Instalación de Docker

Puedes descargar e instalar Docker desde su [Página Oficial](https://www.docker.com/products/docker-desktop/).


### Docker Compose
- #### Así mismo Docker Compose

Puedes descargar e instalar Docker compose siguiendo esta [guia](https://www.docker.com/products/docker-desktop/).
## Instalación

A continuación, ejecutar la siguiente secuencia de pasos para poder ejecutar y correr la aplicación de manera correcta.

Clonar repositorio

```bash
     git clone https://github.com/juanpablodh/desafio-backup.git
```

Nos movemos a la carpeta del proyecto
```bash
    cd desafio-backup
```

Construir la Imagen
```bash
    docker build -t challenge-juanpablodh .  
```

## Configuración

La aplicación usa MongoDB como base de datos. Tener en cuenta la disponibilidad de puertos

Procedemos a abrir el archivo **docker-compose.yml** ubicado en la carpeta raíz del proyecto usando el editor de texto preferido

```bash
    nano docker-compose.yml
```

En la siguiente sección tendremos las **variables de entorno**. Debemos ingresar el Token de autorización para consumir la Api Pública de Meli. Está sería la variable **BEARER_TOKEN**. Los demás parámetros no son necesarios modificarlos.

```yml
    app:
    environment:
      - BEARER_TOKEN=Bearer APP_USR-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - SERVER_PORT=3000
      - PROCESS_BATCH_SIZE=200
      - PROCESS_GROUP_ID_SIZE=20
      - DB_URI=mongodb://mongodb:27017
      - DB_NAME=challenge-meli
```

## Ejecución

Ejecutamos Container

```bash
    docker compose up
```

**¡¡Listo!!** Podemos ingresar a la Página de Bienvenida con un navegador web





http://localhost/3000

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

Para dar uso a nuestra API, podemos guiarnos de la documentación elaborada con Open API. Para eso hacemos clic sobre el botón [Explore Docuementation]

## Referencia API

Esta documentación de Swagger describe las especificaciones de la API para un servicio web RESTful diseñado específicamente para manejar configuraciones y operaciones relacionadas con elementos. Ofrece un conjunto completo de puntos finales para administrar configuraciones y elementos en varios formatos. La API proporciona funcionalidades para la gestión de configuraciones y elementos con estructuras detalladas de solicitudes y respuestas.


Se construyo una bonita documentación usando Swagger Open Api 3.0

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

Puedes acceder mediante el botón [Explore Documentation] o directamente en http://localhost:3000/api/v1/docs

## Utilización

Lo primero que debemos como requisitos para comenzar a cargar nuestros archivos, es crear una configuración de archivo.

En la sección **Configuration** ejecutamos el metodo **POST /configuration**, como input podemos usar la siguiente configuración.

```json
{
    "fileFormat": "text/csv",
    "delimiter": ",",
    "encoding": "utf-8",
    "hasHeaders": true
}

```
Es decir, estamos creando una configuración de procesamiento para los archivos con formato CSV, adicional indicamos el delimitador que el programa utilizara para obtener los valores de sus líneas, el enconding del archivo y un flag que indica que si archivo posee encabezados o no.

**Podemos crear las configuraciones necesarias por tipo de archivo**

Es momento de realizar el cargue de un archivo, en este caso un **data.csv**

En la sección **Item**, ejecutamos el método **POST /loadItemsByFile**. Este nos permite adjuntar un archivo y procesarlo.

Por último, invito que se usen todos los métodos propuestos por la documentación, esto con el fin de aprender un poco más de todas las funcionalidades.