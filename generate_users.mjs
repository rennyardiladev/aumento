import fs from 'fs';

const nombres = {
  mexico: ["juan", "maria", "carlos", "valeria", "andres", "sofia", "diego", "camila", "lucia", "mateo", "alejandro", "isabela", "gabriel", "valentina", "sebastian", "ximena", "santiago", "renata", "nicolas", "paula"],
  colombia: ["juan", "maria", "carlos", "laura", "andres", "catalina", "diego", "valentina", "sebastian", "isabela", "santiago", "mariana", "nicolas", "daniela", "felipe", "ana", "samuel", "sara", "martin", "paula"],
  argentina: ["lucas", "maria", "mateo", "valentina", "benjamin", "julieta", "santiago", "martina", "nicolas", "lola", "agustin", "josefina", "tomas", "ludmila", "martin", "mora", "francisco", "margarita", "bruno", "ines"],
  peru: ["carlos", "maria", "juan", "valeria", "luis", "andrea", "jose", "camila", "miguel", "sofia", "antonio", "paola", "david", "diana", "alexander", "nicole", "fernando", "alessandra", "ricardo", "melissa"],
  chile: ["martin", "isidora", "benjamin", "emilia", "vicente", "trinidad", "agustin", "amelia", "maximiliano", "consuelo", "cristobal", "florencia", "lucas", "josefa", "gaspar", "luciana", "matias", "francisca", "ignacio", "antonia"],
  ecuador: ["juan", "maria", "luis", "valeria", "carlos", "daniela", "andres", "sofia", "diego", "camila", "jose", "nicole", "alex", "mariana", "sebastian", "paola", "samuel", "paula", "martin", "gabriela"],
  bolivia: ["juan", "maria", "carlos", "valeria", "luis", "sofia", "jose", "camila", "miguel", "valentina", "antonio", "isabela", "david", "mariana", "alexander", "paula", "fernando", "catalina", "ricardo", "renata"],
  venezuela: ["jose", "maria", "luis", "valeria", "carlos", "daniela", "juan", "sofia", "miguel", "camila", "antonio", "nicole", "david", "mariana", "alexander", "paola", "fernando", "gabriela", "ricardo", "paula"],
  centroamerica: ["juan", "maria", "carlos", "valeria", "luis", "sofia", "jose", "camila", "miguel", "valentina", "antonio", "isabela", "david", "mariana", "alexander", "paula", "fernando", "catalina", "ricardo", "renata"],
  caribe: ["juan", "maria", "carlos", "valeria", "luis", "daniela", "jose", "camila", "miguel", "sofia", "antonio", "nicole", "david", "mariana", "alexander", "paola", "fernando", "gabriela", "ricardo", "paula"]
};

const apellidos = {
  mexico: ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "hernandez", "perez", "sanchez", "ramirez", "torres", "flores", "rivera", "gomez", "diaz", "reyes", "morales", "cruz", "ortiz", "gutierrez", "ruiz"],
  colombia: ["rodriguez", "martinez", "lopez", "garcia", "gonzalez", "hernandez", "perez", "sanchez", "ramirez", "torres", "gomez", "diaz", "morales", "ruiz", "jimenez", "castro", "vargas", "ruiz", "cortes", "pardo"],
  argentina: ["gonzalez", "rodriguez", "gomez", "fernandez", "lopez", "martinez", "perez", "sanchez", "romero", "sosa", "garcia", "diaz", "suarez", "ferreyra", "rojas", "acosta", "gallardo", "molina", "silva", "benitez"],
  peru: ["garcia", "rodriguez", "lopez", "martinez", "gonzalez", "perez", "sanchez", "ramirez", "hernandez", "flores", "diaz", "torres", "soto", "castro", "ruiz", "morales", "vargas", "castillo", "rojas", "alvarez"],
  chile: ["gonzalez", "munoz", "rojas", "diaz", "perez", "soto", "contreras", "silva", "sepulveda", "morales", "rodriguez", "lopez", "martinez", "fernandez", "garcia", "hernandez", "torres", "romero", "rivera", "castillo"],
  ecuador: ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez", "hernandez", "ramirez", "torres", "flores", "castro", "vargas", "ruiz", "morales", "jimenez", "gomez", "diaz", "cortes", "pardo"],
  bolivia: ["mamani", "quispe", "condori", "flores", "perez", "garcia", "rodriguez", "lopez", "martinez", "gonzalez", "sanchez", "ramirez", "hernandez", "torres", "vargas", "castro", "ruiz", "diaz", "gomez", "cortes"],
  venezuela: ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez", "ramirez", "hernandez", "torres", "flores", "castro", "vargas", "ruiz", "morales", "jimenez", "gomez", "diaz", "cortes", "pardo"],
  centroamerica: ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez", "ramirez", "hernandez", "torres", "flores", "castro", "vargas", "ruiz", "morales", "jimenez", "gomez", "diaz", "cortes", "pardo"],
  caribe: ["garcia", "rodriguez", "martinez", "lopez", "gonzalez", "perez", "sanchez", "ramirez", "hernandez", "torres", "flores", "castro", "vargas", "ruiz", "morales", "jimenez", "gomez", "diaz", "cortes", "pardo"]
};

const paises = Object.keys(nombres);
const usuarios = [];
const total = 5000;

for (let i = 0; i < total; i++) {
  const pais = paises[i % paises.length];
  const nombreList = nombres[pais];
  const apellidoList = apellidos[pais];
  
  const nombre = nombreList[i % nombreList.length];
  const apellido = apellidoList[i % apellidoList.length];
  
  const nombreCorto = nombre.slice(0, Math.min(4, nombre.length - 1));
  const apellidoCorto = apellido.slice(0, Math.min(5, apellido.length - 1));
  
  const asteriscos = '*'.repeat(5);
  const usuario = `@${nombreCorto}${asteriscos}${apellidoCorto}`;
  usuarios.push(usuario);
}

const contenido = usuarios.join('\n');
fs.writeFileSync('/home/xbladeyx/Downloads/aumentodeseguidores/public/users.txt', contenido);
console.log(`Generados ${usuarios.length} usuarios en public/users.txt`);
