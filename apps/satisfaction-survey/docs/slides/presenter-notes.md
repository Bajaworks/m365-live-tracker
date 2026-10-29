---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:20:00Z'
agent_roles: 'engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
task_id: 'T-007'
---

# Notas del presentador

## 1. Copilot UX components

Tiempo: 00:00–01:00

QUÉ DECIR
Hoy construiremos el puente entre una conversación y una interfaz de negocio. El caso es sencillo: una persona evalúa la atención de soporte y después consulta el desempeño de un técnico. Veremos la experiencia y las piezas de código que la hacen posible. La aplicación usa Contoso y datos ficticios.
MENSAJE CLAVE
SPFx aporta la interfaz interactiva dentro de Copilot.
TRANSICIÓN
Presentar el recorrido de la sesión. No abrir todavía el navegador.

Fuentes: 

## 2. Una hora con la demo

Tiempo: 01:00–02:00

QUÉ DECIR
Primero ubicaremos el concepto. Después veremos una encuesta que guarda en SharePoint y un tablero que resume los resultados. Dedicaremos veinte minutos al código. Cerraremos con el diagnóstico de una llamada real de Copilot y dejaremos diez minutos para recursos y preguntas.
MENSAJE CLAVE
La sesión alterna explicación y demostración.
TRANSICIÓN
Explicar dónde vive el componente y quién decide cuándo abrirlo.

Fuentes: 

## 3. La interfaz vive dentro de Copilot

Tiempo: 02:00–05:00

QUÉ DECIR
Hay responsabilidades distintas. El agente interpreta la petición del usuario. La herramienta conecta esa intención con el componente. El componente recibe propiedades y ejecuta la experiencia que programamos. Aquí usaremos React 18 y Fluent UI v9, con SPFx 1.24.0-rc.0, la versión fijada en este repositorio. El despliegue aprovecha el App Catalog de SharePoint.
MENSAJE CLAVE
El modelo decide la llamada, mientras el código implementa la interacción y las validaciones.
TRANSICIÓN
Aterrizar las responsabilidades en las dos herramientas del ejemplo.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps

## 4. Encuesta y desempeño del soporte

Tiempo: 05:00–07:00

QUÉ DECIR
OpenSatisfactionSurvey permite evaluar una atención. ShowTechnicianScorecard consulta el desempeño de un técnico. Los parámetros iniciales evitan volver a escribir datos de la conversación. Las escalas no tienen un valor preseleccionado. Si el resultado es negativo o aparece una nota baja, el comentario se vuelve obligatorio. El tablero muestra resultados del técnico consultado y no lo compara contra otras personas.
MENSAJE CLAVE
El caso cabe en dos herramientas con responsabilidades claras.
TRANSICIÓN
Presentar las diferencias entre el entorno de prueba y la conversación real.

Fuentes: 

## 5. Workbench y Copilot real

Tiempo: 07:00–10:00

QUÉ DECIR
El Workbench carga el componente local y recibe propiedades que introducimos a mano. No usa el agente ni valida si una frase elige la herramienta adecuada. En Copilot real sí entran las instrucciones, las descripciones y la sincronización del paquete. Durante esta demo usaremos Workbench para la experiencia y Copilot real para observar la llamada.
ACCIÓN
Preparar la ventana del Workbench y la lista Encuestas.
TRANSICIÓN
Cambiar la ventana compartida en Teams al navegador. Tener el video del plan B disponible.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components

## 6. Demo de la encuesta y el tablero

Tiempo: 10:00–20:00

QUÉ DECIR
Vamos a completar una atención y después ver su efecto en el tablero. En Workbench introduciré los parámetros a mano, porque aquí estamos probando el componente.
PASOS Y TIEMPO
10–12: abrir OpenSatisfactionSurvey con {"ticketNumber":"4521","technician":"<técnico de prueba>"}. Mostrar campos precargados y escalas vacías.
12–14: elegir Rapidez = 2 y explicar el comentario obligatorio. Completar y enviar.
14–15: mostrar la fila nueva de Encuestas y comprobar el autor con la cuenta de prueba.
15–16: volver a usar el ticket 4521 y mostrar la respuesta anterior.
16–19: abrir ShowTechnicianScorecard con el mismo técnico. Expandir a fullscreen, cambiar periodo y mostrar tendencia, distribución y tabla.
19–20: mostrar un técnico con pocos datos usando el perfil disponible. No prometer un número fijo de respuestas.
PLAN B
Si el Workbench no carga, reproducir docs/plan-b.mp4 desde el bloque de encuesta. Si la lista falla y el tablero usa datos de demostración, señalar su etiqueta.
TRANSICIÓN
Volver al deck para explicar la arquitectura y después compartir VS Code.

Fuentes: 

## 7. Arquitectura de la solución

Tiempo: 20:00–23:00

QUÉ DECIR
La frase llega al agente. Una herramienta abre uno de los dos componentes con sus parámetros. El componente consulta o guarda mediante los servicios compartidos de la aplicación. SharePoint contiene la lista Encuestas y aplica los permisos del usuario. El App Catalog aloja los recursos del paquete. No hemos construido un backend propio para esta demo.
ACCIÓN
Mostrar en VS Code src/copilotComponents y src/shared/services. Explicar que la flecha hacia SharePoint representa lecturas y escrituras del componente, no acceso directo del modelo a todos los datos.
TRANSICIÓN
Ubicar los archivos de entrada del generador y la configuración del agente.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps

## 8. Un proyecto con dos componentes

Tiempo: 23:00–25:00

QUÉ DECIR
El generador de SPFx crea la estructura inicial de un Copilot Component. Podemos agregar otro componente en la misma solución. copilot-agent.json los agrupa en un agente. La carpeta copilot contiene los manifiestos y las instrucciones. La capa shared evita duplicar validaciones, acceso a datos y controles entre encuesta y tablero.
ACCIÓN
Abrir config/copilot-agent.json y señalar los dos componentes y toolDiscovery static. Mostrar la estructura sin ejecutar scaffolding durante la sesión.
TRANSICIÓN
Abrir las propiedades y el manifiesto de la encuesta.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/get-started/build-your-first-copilot-app

## 9. La intención depende de los textos

Tiempo: 25:00–28:00

QUÉ DECIR
Copilot usa las instrucciones del agente, la descripción de la herramienta y las descripciones de las propiedades. Si pedimos calificar el ticket 4521, ticketNumber debe llegar como 4521. Si no nombramos un técnico, no inventamos uno: el formulario permite elegirlo. ShowTechnicianScorecard requiere el técnico y acepta month, quarter, semester o all.
ACCIÓN
Mostrar SatisfactionSurveyFormCopilotComponentProperties.ts y el manifest junto con copilot/instruction.txt. Señalar el optional y el ejemplo de .describe().
MENSAJE CLAVE
Una descripción precisa tiene efecto sobre la llamada.
TRANSICIÓN
Mostrar cómo el componente devuelve contexto al modelo.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components

## 10. El componente informa a Copilot

Tiempo: 28:00–31:00

QUÉ DECIR
Después de guardar, el componente actualiza el contexto del modelo con un resumen de lo ocurrido. El tablero también aporta sus cifras. Los comentarios no se envían al contexto del modelo. El botón Ver desempeño solicita un seguimiento con el técnico actual. Para ampliar el tablero, la aplicación pide fullscreen al host y reacciona a los cambios de contexto.
ACCIÓN
Abrir SatisfactionSurveyFormCopilotComponent.tsx y buscar updateModelContextAsync y sendFollowUpMessageAsync. Después abrir TechnicianScorecard.tsx y buscar requestDisplayModeAsync. Los puntos suspensivos de la diapositiva indican llamadas abreviadas, no código listo para copiar.
TRANSICIÓN
Abrir SiteResolver y SurveyRepository.

Fuentes: 

## 11. Datos y permisos en SharePoint

Tiempo: 31:00–34:00

QUÉ DECIR
En Copilot, el contexto web puede ser la raíz del tenant. SiteResolver localiza el sitio de encuestas o usa la propiedad SatisfactionSurveySite. SurveyRepository resuelve la persona con ensureuser y escribe el identificador en el campo Persona. La aplicación comprueba si el usuario ya respondió el ticket. Los permisos de la lista permiten leer las respuestas y editar solo las propias. Ese alcance de lectura debe encajar con las políticas de la organización.
ACCIÓN
Mostrar SiteResolver.ts, SurveyRepository.ts y fields.ts. Aclarar que la prueba de permisos se hace también con una cuenta no administradora.
TRANSICIÓN
Explicar la geometría de los círculos sin comparar técnicos.

Fuentes: 

## 12. El relleno representa el área

Tiempo: 34:00–36:00

QUÉ DECIR
El promedio va de 1 a 5. Un valor de 1 deja solo el contorno y 5 llena el círculo. Entre ambos, calculamos el radio con la raíz cuadrada de la fracción normalizada. Así, un 3 llena la mitad del área. Es una escala transformada del rango 1 a 5, no un porcentaje de respuestas satisfechas.
ACCIÓN
Mostrar scoreGeometry.ts y las pruebas de los valores 1, 3 y 5. Señalar que la cifra y la etiqueta siguen presentes: el usuario no depende solo del color.
TRANSICIÓN
Volver al flujo de empaquetado y publicación.

Fuentes: 

## 13. Paquete y publicación del agente

Tiempo: 36:00–40:00

QUÉ DECIR
En esta aplicación, release sube la versión del paquete y compila. El autor carga el sppkg y habilita la solución en el App Catalog. Add to Teams sincroniza el agente. El nombre del botón puede confundir: este paso publica el agente para Copilot. Hay una versión de solución y otra del manifiesto del agente. El build conserva el estado de los cambios del agente en teams/.copilot-agent-hotfix.json.
ACCIÓN
Mostrar package-solution.json, copilot/manifest.json y el archivo de configuración del agente. No ejecutar release con npm run start activo: ambos usan la salida de compilación. El despliegue queda preparado antes de la sesión.
TRANSICIÓN
Cambiar a Copilot real para inspeccionar una llamada.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components

## 14. Diagnóstico con Agent debug info

Tiempo: 40:00–42:00

QUÉ DECIR
Antes de cambiar código, revisaremos si el agente seleccionó la herramienta y qué argumentos envió. Activamos developer mode, iniciamos una conversación nueva y abrimos Agent debug info. Agent version identifica el agente cargado. Actions muestra la selección. Executed actions contiene la llamada, su versión, argumentos, URL y respuesta.
ACCIÓN
Compartir la ventana de Copilot. Enviar -developer on y abrir una conversación nueva con Encuestas de Satisfacción.
TRANSICIÓN
Enviar la frase de prueba y examinar el resultado.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components

## 15. Licencia: documentación y resultado observado

Tiempo: 42:00–47:00

QUÉ DECIR
La documentación oficial de preview dice que no requiere licencia de Microsoft 365 Copilot. Sin embargo, el handoff de esta demo registra un 403 copilot_license_required con Copilot Chat Basic. No vamos a presentar esa observación como un requisito universal. La herramienta quedó seleccionada y los argumentos fueron correctos en la prueba I1, pero la ejecución no llegó a dibujar el componente. Eso tampoco certifica todo el sistema.
PASOS
Enviar «Quiero calificar la atención del ticket 4600, me ayudó <técnico de prueba>». Abrir Actions, comprobar Tool Arguments y leer la respuesta. Comparar solutionId con el paquete si aparece otro error. Si ahora funciona, mostrar el resultado actual y explicar la diferencia respecto al registro anterior.
PLAN B
Si Copilot no responde, usar la captura real developer-mode-403.png cuando esté disponible. No representar una captura simulada como evidencia.
TRANSICIÓN
Volver al deck para cerrar las limitaciones.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps

## 16. Alcance de la preview

Tiempo: 47:00–50:00

QUÉ DECIR
La documentación consultada mantiene la función en preview y advierte que APIs, esquemas y herramientas pueden cambiar. El renderizado de estos componentes está limitado a la experiencia de Copilot en la preview y la distribución por marketplace todavía no está soportada. La UI compartida podría reutilizarse en otros hosts de SPFx, pero eso exige su adaptación y no demuestra soporte de esta app en todas las superficies.
MENSAJE CLAVE
La demo fija una versión y muestra lo probado. No damos una fecha de disponibilidad general.
TRANSICIÓN
Presentar las fuentes y reservar tiempo para preguntas.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps

## 17. Código y recursos para continuar

Tiempo: 50:00–52:00

QUÉ DECIR
El README de la aplicación explica cómo configurar una copia local y aprovisionar los datos. La guía de despliegue documenta los pasos y la matriz permite repetir la evaluación de intención. Microsoft Learn y los ejemplos oficiales ayudan a seguir los cambios del producto.
ACCIÓN
Abrir el README del repositorio local. Compartir únicamente la URL pública que el autor confirme para esta demo. El remote actual pertenece al framework VISION, por lo que no debe anunciarse como la publicación final de esta aplicación.
TRANSICIÓN
Abrir preguntas y mantener el Workbench a mano para mostrar un detalle si hace falta.

Fuentes: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components https://github.com/pnp/spfx-copilot-apps

## 18. Preguntas

Tiempo: 52:00–60:00

QUÉ DECIR
Podemos conversar sobre selección de herramientas, validación del formulario, permisos, empaquetado o diagnóstico. Si una pregunta depende de una capacidad de producto no probada, separar lo observado de lo que habría que verificar.
TIEMPO
Reservar siete minutos para preguntas y uno para el cierre. Si una pregunta requiere cambiar configuración o desplegar, anotarla para después de la sesión.
CIERRE
La experiencia combina la intención del agente con una interfaz que controla los datos y las acciones del usuario. El código compartido y el diagnóstico facilitan repetir la solución en otro entorno. Agradecer la participación y recordar los recursos mostrados.
PLAN B
Permanecer en esta diapositiva si se agota el tiempo. El cierre no depende de una última llamada de red.

Fuentes: 
