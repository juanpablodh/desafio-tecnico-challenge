# Desafrio Teotico

## Procesos

Los procesos son entidades independientes que se ejecutan en un sistema operativo. Cada proceso tiene su propio espacio de direcciones, su propio conjunto de recursos y su propio flujo de control.

### Caso de uso:

Para ejecutar aplicaciones que requieren un alto grado de aislamiento entre procesos. Por ejemplo, un servidor web puede ejecutarse en un proceso separado del navegador web del cliente. Esto permite que el servidor web se bloquee sin afectar al navegador web.
Para ejecutar aplicaciones que requieren un alto grado de control sobre los recursos. Por ejemplo, un sistema operativo puede ejecutarse en un proceso separado de las aplicaciones de usuario. Esto permite que el sistema operativo controle los recursos del hardware, como la CPU y la memoria.

##  Hilos

Los hilos son entidades que se ejecutan dentro de un proceso. Todos los hilos de un proceso comparten el mismo espacio de direcciones y recursos, pero tienen su propio flujo de control.

### Caso de uso:

Para ejecutar tareas que pueden ejecutarse de forma concurrente. Por ejemplo, un navegador web puede usar varios hilos para cargar diferentes páginas web al mismo tiempo.
Para ejecutar tareas que pueden bloquearse. Por ejemplo, un hilo puede bloquearse esperando una respuesta de un recurso externo, como una base de datos o una red.

## Corrutinas

Las corrutinas son un modelo de programación que permite escribir código asíncrono de forma secuencial. Las corrutinas se basan en la idea de las funciones de suspensión, que pueden pausar la ejecución de una corrutina y reanudarla más tarde.

### Caso de uso:

Para ejecutar tareas que pueden tardar mucho tiempo en completarse. Por ejemplo, un hilo de usuario puede usar una corrutina para cargar una imagen de Internet.
Para ejecutar tareas que deben ejecutarse en un orden específico. Por ejemplo, un hilo de servidor puede usar una corrutina para procesar una solicitud de cliente.
Conclusiones

El uso de procesos, hilos o corrutinas depende del problema específico que se esté abordando. Los procesos son ideales para aplicaciones que requieren un alto grado de aislamiento o control sobre los recursos. Los hilos son ideales para aplicaciones que pueden ejecutar tareas de forma concurrente o que pueden bloquearse. Las corrutinas son ideales para aplicaciones que pueden ejecutar tareas asíncronas de forma secuencial.

# Optimización de recursos del sistema operativo

Es importante diseñar un enfoque eficiente para optimizar el uso de los recursos del sistema operativo y minimizar el tiempo necesario para completar todas las consultas. Aquí hay una estrategia general de cómo podrías abordar este problema:

Paralelización:

Divide la tarea en múltiples hilos o procesos para aprovechar al máximo los recursos del sistema. Esto permite realizar múltiples consultas simultáneamente en lugar de una a la vez.
Utiliza bibliotecas o marcos de trabajo que faciliten la concurrencia, como asyncio en Python, para administrar múltiples solicitudes concurrentes.
Búfer de elementos:

Divide los 1.000.000 de elementos en lotes más pequeños o páginas. Esto evita la sobrecarga de memoria y la congestión de la red al procesar todos los elementos a la vez.
Procesa cada lote o página antes de pasar al siguiente para controlar el flujo de datos.
Manejo de errores y reintentos:

Implementa una lógica robusta de manejo de errores y reintentos para manejar posibles problemas de conexión, errores del servidor y otros problemas comunes en llamadas a la API. Esto garantiza que las consultas no se interrumpan debido a fallas temporales.
Caché de respuestas:

Almacena en caché las respuestas de la API para evitar consultas repetidas a elementos que ya han sido procesados. Esto puede ahorrar tiempo y recursos en futuras ejecuciones del proceso.
Limitación de solicitudes:

Comprueba si la API a la que estás accediendo tiene restricciones de velocidad o límites de solicitudes por minuto. Asegúrate de respetar estos límites para evitar bloqueos o suspensiones.
Monitoreo y registro:

Implementa un sistema de monitoreo y registro para realizar un seguimiento del progreso y detectar problemas en tiempo real. Esto te permitirá ajustar y optimizar el proceso según sea necesario.
Almacenamiento eficiente de resultados:

Almacena los resultados de las consultas en un formato eficiente, como una base de datos, para su posterior análisis o uso.
Escalamiento horizontal: