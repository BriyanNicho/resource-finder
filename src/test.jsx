console.log('TEST.JSX is executing');
const debugDiv = document.createElement('div');
debugDiv.innerHTML = '<div style="background:cyan; padding:20px; border:5px solid black; font-size: 24px; position:fixed; top:50px; left:50px; z-index:9999;">TEST JSX EXECUTED</div>';
document.body.appendChild(debugDiv);
