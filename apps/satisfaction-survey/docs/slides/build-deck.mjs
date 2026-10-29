/**
 * @generated_by_model gpt-6
 * @generated_at 2026-10-24T16:20:00Z
 * @agent_roles engineering-technical-writer
 * @vision_command continue_sprint --sprint 4
 * @sprint_number 4
 * @task_id T-007
 * Rebuild with the bundled @oai/artifact-tool runtime. No SPFx build required.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const runtime = process.env.CODEX_PRIMARY_RUNTIME_ROOT;
const skill = process.env.PRESENTATIONS_SKILL_DIR;
if(!runtime || !skill) throw new Error('Set CODEX_PRIMARY_RUNTIME_ROOT and PRESENTATIONS_SKILL_DIR before building the deck.');
const root = process.cwd();
const build = path.join(root, 'tmp/slides-sprint4');
const output = path.join(root, 'apps/satisfaction-survey/docs/slides');
const modules = path.join(runtime, 'node/node_modules');
process.env.RUNTIME_NODE_MODULES = modules;
const requireRuntime = createRequire(path.join(modules, '__runtime__.cjs'));
const { Presentation, PresentationFile } = await import(pathToFileURL(requireRuntime.resolve('@oai/artifact-tool')).href);
const { finalizePresentation } = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
await fs.mkdir(build, { recursive: true });
await fs.mkdir(output, { recursive: true });

const overview = 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps';
const troubleshooting = 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/troubleshooting-copilot-ux-components';
const tutorial = 'https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/get-started/build-your-first-copilot-app';
const local = 'Fuentes del proyecto: docs/demo-script.md, copilot/instruction.txt, config/copilot-agent.json y src/. Rutas relativas a apps/satisfaction-survey/.';
const slides = [
  { kind:'cover', title:'Copilot UX\ncomponents', subtitle:'Encuestas de satisfacción con SharePoint Framework', time:'00:00–01:00', label:'Microsoft 365 Live 2026',
    notes:'QUÉ DECIR\nHoy construiremos el puente entre una conversación y una interfaz de negocio. El caso es sencillo: una persona evalúa la atención de soporte y después consulta el desempeño de un técnico. Veremos la experiencia y las piezas de código que la hacen posible. La aplicación usa Contoso y datos ficticios.\nMENSAJE CLAVE\nSPFx aporta la interfaz interactiva dentro de Copilot.\nTRANSICIÓN\nPresentar el recorrido de la sesión. No abrir todavía el navegador.' },
  { title:'Una hora con la demo', time:'01:00–02:00', kind:'agenda',
    rows:[['Bloque','Minutos','En pantalla'],['Concepto y caso','00–10','Diapositivas'],['Demo como usuario','10–20','Workbench y lista'],['Cómo se construyó','20–40','Código y arquitectura'],['Diagnóstico','40–47','Copilot real'],['Limitaciones','47–50','Diapositivas'],['Recursos y preguntas','50–60','Repositorio y conversación']],
    notes:'QUÉ DECIR\nPrimero ubicaremos el concepto. Después veremos una encuesta que guarda en SharePoint y un tablero que resume los resultados. Dedicaremos veinte minutos al código. Cerraremos con el diagnóstico de una llamada real de Copilot y dejaremos diez minutos para recursos y preguntas.\nMENSAJE CLAVE\nLa sesión alterna explicación y demostración.\nTRANSICIÓN\nExplicar dónde vive el componente y quién decide cuándo abrirlo.' },
  { title:'La interfaz vive dentro de Copilot', time:'02:00–05:00',
    left:['Agente declarativo','Interpreta la petición y selecciona una herramienta.'], right:['Componente SPFx','Recibe parámetros y presenta una interfaz interactiva.'],
    bottom:'El paquete .sppkg reúne el agente y los componentes',
    notes:'QUÉ DECIR\nHay responsabilidades distintas. El agente interpreta la petición del usuario. La herramienta conecta esa intención con el componente. El componente recibe propiedades y ejecuta la experiencia que programamos. Aquí usaremos React 18 y Fluent UI v9, con SPFx 1.24.0 GA, la versión fijada en este repositorio. El despliegue aprovecha el App Catalog de SharePoint.\nMENSAJE CLAVE\nEl modelo decide la llamada, mientras el código implementa la interacción y las validaciones.\nTRANSICIÓN\nAterrizar las responsabilidades en las dos herramientas del ejemplo.', sources:[overview] },
  { title:'Encuesta y desempeño del soporte', time:'05:00–07:00',
    left:['Encuesta','Ticket y técnico precargados.\nCuatro dimensiones del 1 al 5.\nEnvío explícito del usuario.'],
    right:['Tablero','Resumen por técnico y periodo.\nTendencia y distribución.\nComentarios sin autor.'],
    bottom:'Comprensión · Rapidez · Habilidad · Comunicación',
    notes:'QUÉ DECIR\nOpenSatisfactionSurvey permite evaluar una atención. ShowTechnicianScorecard consulta el desempeño de un técnico. Los parámetros iniciales evitan volver a escribir datos de la conversación. Las escalas no tienen un valor preseleccionado. Si el resultado es negativo o aparece una nota baja, el comentario se vuelve obligatorio. El tablero muestra resultados del técnico consultado y no lo compara contra otras personas.\nMENSAJE CLAVE\nEl caso cabe en dos herramientas con responsabilidades claras.\nTRANSICIÓN\nPresentar las diferencias entre el entorno de prueba y la conversación real.' },
  { title:'Workbench y Copilot real', time:'07:00–10:00', kind:'table',
    rows:[['Aspecto','Workbench','Copilot real'],['Entrada','Parámetros manuales','Frase del usuario'],['Qué valida','UI, datos y modos','Intención y llamada'],['Código','Servidor local','Paquete desplegado'],['Uso en esta sesión','Demo interactiva','Diagnóstico con debug']],
    notes:'QUÉ DECIR\nEl Workbench carga el componente local y recibe propiedades que introducimos a mano. No usa el agente ni valida si una frase elige la herramienta adecuada. En Copilot real sí entran las instrucciones, las descripciones y la sincronización del paquete. Durante esta demo usaremos Workbench para la experiencia y Copilot real para observar la llamada.\nACCIÓN\nPreparar la ventana del Workbench y la lista Encuestas.\nTRANSICIÓN\nCambiar la ventana compartida en Teams al navegador. Tener el video del plan B disponible.', sources:[troubleshooting] },
  { title:'Demo de la encuesta y el tablero', time:'10:00–20:00', kind:'demo',
    subtitle:'Ticket 4521 · Técnico de prueba',
    lines:['Encuesta con contexto y comentario obligatorio','Respuesta guardada y control de duplicados','Tablero inline, pantalla completa y periodo'],
    notes:'QUÉ DECIR\nVamos a completar una atención y después ver su efecto en el tablero. En Workbench introduciré los parámetros a mano, porque aquí estamos probando el componente.\nPASOS Y TIEMPO\n10–12: abrir OpenSatisfactionSurvey con {"ticketNumber":"4521","technician":"<técnico de prueba>"}. Mostrar campos precargados y escalas vacías.\n12–14: elegir Rapidez = 2 y explicar el comentario obligatorio. Completar y enviar.\n14–15: mostrar la fila nueva de Encuestas y comprobar el autor con la cuenta de prueba.\n15–16: volver a usar el ticket 4521 y mostrar la respuesta anterior.\n16–19: abrir ShowTechnicianScorecard con el mismo técnico. Expandir a fullscreen, cambiar periodo y mostrar tendencia, distribución y tabla.\n19–20: mostrar un técnico con pocos datos usando el perfil disponible. No prometer un número fijo de respuestas.\nPLAN B\nSi el Workbench no carga, reproducir docs/plan-b.mp4 desde el bloque de encuesta. Si la lista falla y el tablero usa datos de demostración, señalar su etiqueta.\nTRANSICIÓN\nVolver al deck para explicar la arquitectura y después compartir VS Code.' },
  { title:'Arquitectura de la solución', time:'20:00–23:00', kind:'architecture',
    notes:'QUÉ DECIR\nLa frase llega al agente. Una herramienta abre uno de los dos componentes con sus parámetros. El componente consulta o guarda mediante los servicios compartidos de la aplicación. SharePoint contiene la lista Encuestas y aplica los permisos del usuario. El App Catalog aloja los recursos del paquete. No hemos construido un backend propio para esta demo.\nACCIÓN\nMostrar en VS Code src/copilotComponents y src/shared/services. Explicar que la flecha hacia SharePoint representa lecturas y escrituras del componente, no acceso directo del modelo a todos los datos.\nTRANSICIÓN\nUbicar los archivos de entrada del generador y la configuración del agente.', sources:[overview] },
  { title:'Un proyecto con dos componentes', time:'23:00–25:00', kind:'code',
    code:'yo @microsoft/sharepoint\n\ncopilot/\nconfig/copilot-agent.json\nsrc/copilotComponents/\n  satisfactionSurveyForm/\n  technicianScorecard/\nsrc/shared/',
    aside:'Un agente agrupa las dos herramientas.\n\nReact comparte modelo, servicios y controles.',
    notes:'QUÉ DECIR\nEl generador de SPFx crea la estructura inicial de un Copilot Component. Podemos agregar otro componente en la misma solución. copilot-agent.json los agrupa en un agente. La carpeta copilot contiene los manifiestos y las instrucciones. La capa shared evita duplicar validaciones, acceso a datos y controles entre encuesta y tablero.\nACCIÓN\nAbrir config/copilot-agent.json y señalar los dos componentes y toolDiscovery static. Mostrar la estructura sin ejecutar scaffolding durante la sesión.\nTRANSICIÓN\nAbrir las propiedades y el manifiesto de la encuesta.', sources:[tutorial] },
  { title:'La intención depende de los textos', time:'25:00–28:00',
    left:['Qué debe abrirse','instruction.txt define la conducta.\nEl manifest describe la herramienta.'],
    right:['Con qué parámetros','El esquema zod usa .describe().\nEl agente omite los datos ausentes.'],
    bottom:'OpenSatisfactionSurvey(ticketNumber?, technician?)',
    notes:'QUÉ DECIR\nCopilot usa las instrucciones del agente, la descripción de la herramienta y las descripciones de las propiedades. Si pedimos calificar el ticket 4521, ticketNumber debe llegar como 4521. Si no nombramos un técnico, no inventamos uno: el formulario permite elegirlo. ShowTechnicianScorecard requiere el técnico y acepta month, quarter, semester o all.\nACCIÓN\nMostrar SatisfactionSurveyFormCopilotComponentProperties.ts y el manifest junto con copilot/instruction.txt. Señalar el optional y el ejemplo de .describe().\nMENSAJE CLAVE\nUna descripción precisa tiene efecto sobre la llamada.\nTRANSICIÓN\nMostrar cómo el componente devuelve contexto al modelo.', sources:[troubleshooting] },
  { title:'El componente informa a Copilot', time:'28:00–31:00', kind:'code',
    code:'updateModelContextAsync(...)\n\nsendFollowUpMessageAsync(...)\n\nrequestDisplayModeAsync(\n  \'fullscreen\'\n)',
    aside:'Encuesta guardada y cifras del tablero.\n\nSeguimiento «Ver desempeño».\n\nEl host controla la vista.',
    notes:'QUÉ DECIR\nDespués de guardar, el componente actualiza el contexto del modelo con un resumen de lo ocurrido. El tablero también aporta sus cifras. Los comentarios no se envían al contexto del modelo. El botón Ver desempeño solicita un seguimiento con el técnico actual. Para ampliar el tablero, la aplicación pide fullscreen al host y reacciona a los cambios de contexto.\nACCIÓN\nAbrir SatisfactionSurveyFormCopilotComponent.tsx y buscar updateModelContextAsync y sendFollowUpMessageAsync. Después abrir TechnicianScorecard.tsx y buscar requestDisplayModeAsync. Los puntos suspensivos de la diapositiva indican llamadas abreviadas, no código listo para copiar.\nTRANSICIÓN\nAbrir SiteResolver y SurveyRepository.' },
  { title:'Datos y permisos en SharePoint', time:'31:00–34:00', kind:'table',
    rows:[['Responsabilidad','Implementación de la demo'],['Sitio','/sites/encuestas o propiedad del tenant'],['Lista','Encuestas, columnas m365live_*'],['Técnico','Campo Persona por identificador'],['Duplicados','Ticket y usuario'],['Permisos','Lectura general, edición de lo propio']],
    notes:'QUÉ DECIR\nEn Copilot, el contexto web puede ser la raíz del tenant. SiteResolver localiza el sitio de encuestas o usa la propiedad SatisfactionSurveySite. SurveyRepository resuelve la persona con ensureuser y escribe el identificador en el campo Persona. La aplicación comprueba si el usuario ya respondió el ticket. Los permisos de la lista permiten leer las respuestas y editar solo las propias. Ese alcance de lectura debe encajar con las políticas de la organización.\nACCIÓN\nMostrar SiteResolver.ts, SurveyRepository.ts y fields.ts. Aclarar que la prueba de permisos se hace también con una cuenta no administradora.\nTRANSICIÓN\nExplicar la geometría de los círculos sin comparar técnicos.' },
  { title:'El relleno representa el área', time:'34:00–36:00', kind:'geometry',
    notes:'QUÉ DECIR\nEl promedio va de 1 a 5. Un valor de 1 deja solo el contorno y 5 llena el círculo. Entre ambos, calculamos el radio con la raíz cuadrada de la fracción normalizada. Así, un 3 llena la mitad del área. Es una escala transformada del rango 1 a 5, no un porcentaje de respuestas satisfechas.\nACCIÓN\nMostrar scoreGeometry.ts y las pruebas de los valores 1, 3 y 5. Señalar que la cifra y la etiqueta siguen presentes: el usuario no depende solo del color.\nTRANSICIÓN\nVolver al flujo de empaquetado y publicación.' },
  { title:'Paquete y publicación del agente', time:'36:00–40:00', kind:'table',
    rows:[['Paso','Resultado'],['npm run release','Versión del paquete y .sppkg'],['Upload y Deploy','Solución habilitada en App Catalog'],['Add to Teams','Agente en el catálogo del tenant'],['Conversación nueva','Verificación de versión y herramientas']],
    notes:'QUÉ DECIR\nEn esta aplicación, release sube la versión del paquete y compila. El autor carga el sppkg y habilita la solución en el App Catalog. Add to Teams sincroniza el agente. El nombre del botón puede confundir: este paso publica el agente para Copilot. Hay una versión de solución y otra del manifiesto del agente. El build conserva el estado de los cambios del agente en teams/.copilot-agent-hotfix.json.\nACCIÓN\nMostrar package-solution.json, copilot/manifest.json y el archivo de configuración del agente. No ejecutar release con npm run start activo: ambos usan la salida de compilación. El despliegue queda preparado antes de la sesión.\nTRANSICIÓN\nCambiar a Copilot real para inspeccionar una llamada.', sources:[overview, troubleshooting] },
  { title:'Diagnóstico con Agent debug info', time:'40:00–42:00', kind:'code',
    code:'-developer on\n\nConversación nueva\n\nAgent version\nActions\nExecuted actions',
    aside:'Herramienta seleccionada\n\nArgumentos enviados\n\nMCP Server Url y respuesta',
    notes:'QUÉ DECIR\nAntes de cambiar código, revisaremos si el agente seleccionó la herramienta y qué argumentos envió. Activamos developer mode, iniciamos una conversación nueva y abrimos Agent debug info. Agent version identifica el agente cargado. Actions muestra la selección. Executed actions contiene la llamada, su versión, argumentos, URL y respuesta.\nACCIÓN\nCompartir la ventana de Copilot. Enviar -developer on y abrir una conversación nueva con Encuestas de Satisfacción.\nTRANSICIÓN\nEnviar la frase de prueba y examinar el resultado.', sources:[troubleshooting] },
  { title:'Licencia: documentación y resultado observado', time:'42:00–47:00',
    left:['Documentación de preview','Microsoft indica que no exige licencia de Microsoft 365 Copilot durante la preview.'],
    right:['Resultado de esta demo','Copilot Chat Basic devolvió 403 con copilot_license_required. El Workbench funcionó.'],
    bottom:'La respuesta del servicio documenta este entorno, no una regla universal',
    notes:'QUÉ DECIR\nLa documentación oficial de preview dice que no requiere licencia de Microsoft 365 Copilot. Sin embargo, el handoff de esta demo registra un 403 copilot_license_required con Copilot Chat Basic. No vamos a presentar esa observación como un requisito universal. La herramienta quedó seleccionada y los argumentos fueron correctos en la prueba I1, pero la ejecución no llegó a dibujar el componente. Eso tampoco certifica todo el sistema.\nPASOS\nEnviar «Quiero calificar la atención del ticket 4600, me ayudó <técnico de prueba>». Abrir Actions, comprobar Tool Arguments y leer la respuesta. Comparar solutionId con el paquete si aparece otro error. Si ahora funciona, mostrar el resultado actual y explicar la diferencia respecto al registro anterior.\nPLAN B\nSi Copilot no responde, usar la captura real developer-mode-403.png cuando esté disponible. No representar una captura simulada como evidencia.\nTRANSICIÓN\nVolver al deck para cerrar las limitaciones.', sources:[overview], localSource:'HANDOFF.md, hallazgos de licencia e I1 registrados el 2026-10-24.' },
  { title:'Alcance de la preview', time:'47:00–50:00',
    lines:['APIs, esquemas y herramientas sujetos a cambios','Renderizado en Microsoft 365 Copilot durante la preview','Distribución privada mediante App Catalog','Validación de licencia y permisos en el entorno de destino'],
    notes:'QUÉ DECIR\nLa documentación consultada mantiene la función en preview y advierte que APIs, esquemas y herramientas pueden cambiar. El renderizado de estos componentes está limitado a la experiencia de Copilot en la preview y la distribución por marketplace todavía no está soportada. La UI compartida podría reutilizarse en otros hosts de SPFx, pero eso exige su adaptación y no demuestra soporte de esta app en todas las superficies.\nMENSAJE CLAVE\nLa demo fija una versión y muestra lo probado. No damos una fecha de disponibilidad general.\nTRANSICIÓN\nPresentar las fuentes y reservar tiempo para preguntas.', sources:[overview] },
  { title:'Código y recursos para continuar', time:'50:00–52:00', kind:'resources',
    lines:['README: instalación y prueba en Workbench','docs/deployment.md: despliegue y diagnóstico','docs/intent-matrix.md: tres corridas de intención','Microsoft Learn: overview y troubleshooting','Ejemplos: github.com/pnp/spfx-copilot-apps'],
    notes:'QUÉ DECIR\nEl README de la aplicación explica cómo configurar una copia local y aprovisionar los datos. La guía de despliegue documenta los pasos y la matriz permite repetir la evaluación de intención. Microsoft Learn y los ejemplos oficiales ayudan a seguir los cambios del producto.\nACCIÓN\nAbrir el README del repositorio local. Compartir únicamente la URL pública que el autor confirme para esta demo. El remote actual pertenece al framework VISION, por lo que no debe anunciarse como la publicación final de esta aplicación.\nTRANSICIÓN\nAbrir preguntas y mantener el Workbench a mano para mostrar un detalle si hace falta.', sources:[overview, troubleshooting, 'https://github.com/pnp/spfx-copilot-apps'] },
  { title:'Preguntas', time:'52:00–60:00', kind:'closing',
    subtitle:'¿Qué interfaz de negocio llevarías a una conversación?',
    notes:'QUÉ DECIR\nPodemos conversar sobre selección de herramientas, validación del formulario, permisos, empaquetado o diagnóstico. Si una pregunta depende de una capacidad de producto no probada, separar lo observado de lo que habría que verificar.\nTIEMPO\nReservar siete minutos para preguntas y uno para el cierre. Si una pregunta requiere cambiar configuración o desplegar, anotarla para después de la sesión.\nCIERRE\nLa experiencia combina la intención del agente con una interfaz que controla los datos y las acciones del usuario. El código compartido y el diagnóstico facilitan repetir la solución en otro entorno. Agradecer la participación y recordar los recursos mostrados.\nPLAN B\nPermanecer en esta diapositiva si se agota el tiempo. El cierre no depende de una última llamada de red.' }
];

const p = Presentation.create({ slideSize: { width:1280, height:720 } });
p.theme.defaultFont = 'Arial';
const C = { bg:'#F5F6F8', ink:'#13233C', muted:'#44556E', accent:'#2255C4', dark:'#101F37', pale:'#B9D0FF' };
function text(s, value, x,y,w,h,size=30,color=C.ink,bold=false,font='Arial') {
  const shape = s.shapes.add({ geometry:'textbox', name:value.slice(0,50), position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0} });
  shape.text = value;
  shape.text.style = {typeface:font,fontSize:size,color,bold};
  shape.text.insets = 0;
  return shape;
}
function table(s, rows, y=205, widths=[340,796]) {
  const t = s.tables.add({rows:rows.length,columns:rows[0].length,left:72,top:y,width:1136,height:rows.length*61,columnWidths:widths,values:rows});
  for(let r=0;r<rows.length;r++) for(let c=0;c<rows[0].length;c++) {
    const cell=t.getCell(r,c); cell.fill=r===0?C.dark:(r%2?'#FFFFFF':'#E8ECF2');
    cell.text.style={typeface:'Arial',fontSize:26,color:r===0?'#FFFFFF':C.ink,bold:r===0};
  }
  return t;
}
function diagram(s) {
  const names=['Usuario','Agente y\nherramienta','Componente\nSPFx','SharePoint\nEncuestas'];
  names.forEach((name,i)=>{
    const x=72+i*288;
    const sh=s.shapes.add({geometry:'rect',name:'Nodo '+name,position:{left:x,top:252,width:240,height:140},fill:'#FFFFFF',line:{fill:C.accent,width:2}});
    sh.text=name; sh.text.style={typeface:'Arial',fontSize:29,bold:true,color:C.ink};
    if(i<3) s.shapes.add({geometry:'rightArrow',name:'Flujo',position:{left:x+247,top:305,width:32,height:28},fill:C.accent,line:{fill:'none',width:0}});
  });
  text(s,'Intención y parámetros',72,427,516,50,29,C.accent,true);
  text(s,'Lectura y escritura con identidad del usuario',648,427,550,100,29,C.accent,true);
  text(s,'App Catalog aloja los recursos del paquete .sppkg',72,568,1136,52,29);
}
for(const [i,d] of slides.entries()) {
  const s=p.slides.add(); const dark=['cover','demo','closing'].includes(d.kind);
  s.background.fill=dark?C.dark:C.bg;
  const ink=dark?'#FFFFFF':C.ink;
  if(d.kind==='cover') {
    text(s,d.label,72,70,1136,50,26,C.pale);
    text(s,d.title,72,195,1136,200,74,'#FFFFFF',true);
    text(s,d.subtitle,72,460,1070,110,35,'#FFFFFF');
  } else {
    text(s,d.title,72,68,1136,118,44,ink,true);
    if(d.kind==='agenda') table(s,d.rows,196,[560,170,406]);
    else if(d.kind==='table') table(s,d.rows,205,d.rows[0].length===3?[290,423,423]:[350,786]);
    else if(d.kind==='architecture') diagram(s);
    else if(d.kind==='geometry') {
      text(s,'r = R × √((v − 1) / 4)',72,220,1136,110,60,C.accent,true);
      table(s,[['Valor','Radio','Área llena'],['1','0','0 %'],['3','R × √0.5','50 %'],['5','R','100 %']],380,[280,430,426]);
    } else if(d.kind==='code') {
      text(s,d.code,72,215,690,400,30,C.ink,false,'Consolas');
      text(s,d.aside,830,220,378,395,29,C.muted);
    } else if(d.left) {
      text(s,d.left[0],72,220,520,60,32,C.accent,true);
      text(s,d.left[1],72,305,520,250,31);
      text(s,d.right[0],688,220,520,60,32,C.accent,true);
      text(s,d.right[1],688,305,520,250,31);
      text(s,d.bottom,72,588,1136,52,26,C.muted);
    } else if(d.kind==='closing') text(s,d.subtitle,72,250,1080,200,52,'#FFFFFF');
    else if(d.kind==='demo') {
      text(s,d.subtitle,72,215,1136,60,32,C.pale);
      d.lines.forEach((line,j)=>text(s,line,72,330+j*88,1136,72,35,'#FFFFFF'));
    } else d.lines.forEach((line,j)=>text(s,line,72,220+j*88,1136,74,32));
  }
  text(s,`${String(i+1).padStart(2,'0')}   ${d.time}`,72,665,1136,30,19,dark?C.pale:C.muted);
  s.speakerNotes.text=`DIAPOSITIVA ${i+1}. ${d.title.replaceAll('\n',' ')}\nTIEMPO ${d.time} (minutos de la sesión)\n\n${d.notes}\n\nFUENTES\n${d.sources?d.sources.join('\n'):local}${d.localSource?'\n'+d.localSource:''}\nConsulta de documentación: 2026-10-24.`;
}

await fs.writeFile(path.join(output,'presenter-notes.md'),`---\ngenerated_by_model: 'gpt-6'\ngenerated_at: '2026-10-24T16:20:00Z'\nagent_roles: 'engineering-technical-writer'\nvision_command: 'continue_sprint --sprint 4'\nsprint_number: 4\ntask_id: 'T-007'\n---\n\n# Notas del presentador\n\n${slides.map((d,i)=>`## ${i+1}. ${d.title.replaceAll('\n',' ')}\n\nTiempo: ${d.time}\n\n${d.notes}\n\nFuentes: ${(d.sources||[]).join(' ')}\n`).join('\n')}`);
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
console.log('Draft PPTX exported');
const py=path.join(runtime,'python/python.exe');
const meta=spawnSync(py,[path.join(output,'deck-metadata.py'),candidate],{encoding:'utf8'});
if(meta.status!==0) throw new Error(String(meta.error||meta.stderr||meta.stdout));
let revision=1;
let finalPath;
while(true) {
  finalPath=path.join(output,`copilot-ux-components-m365live2026-v${revision}.pptx`);
  try { await fs.access(finalPath); revision++; } catch { break; }
}
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath,pythonExecutable:py,
  integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...[2,5,11,12,13].flatMap(n=>['--require-native-table-slide',String(n)])],
  explicitTotalSlideCount:slides.length,requiredNativeTableOwnerSlides:[2,5,11,12,13],requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'design',families:['Arial','Consolas']},verifyArtifactToolImport:true,
  receiptPath:path.join(build,`validation-v${revision}.json`)});
console.log('Final PPTX validated');
for(const [i,s] of p.slides.items.entries()) {
  const blob=await p.export({slide:s,format:'png',scale:1});
  await fs.writeFile(path.join(build,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
  console.log(`Rendered ${i+1}/${slides.length}`);
}
// The installed artifact-tool PDF exporter has an unresolved standard-font alias.
// Preserve the rendered slide appearance in the PDF, with the PPTX editable.
const pdfmeta=spawnSync(py,[path.join(output,'deck-metadata.py'),'--from-previews',build,path.join(output,'copilot-ux-components-m365live2026.pdf')],{encoding:'utf8'});
if(pdfmeta.status!==0) throw new Error(String(pdfmeta.error||pdfmeta.stderr||pdfmeta.stdout));
console.log('PPTX, PDF, notes and previews ready.');
