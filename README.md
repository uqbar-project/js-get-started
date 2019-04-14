# js-get-started
Proyecto para ir aprendiendo el desarrollo de aplicaciones con javascript. 

## Clase 1: Herramientas y Ambiente de desarrollo

Javascript es un lenguaje que tradicionalmente ejecuta en el browser. En su comienzos se utilizó para darle dinamismo a las páginas HTMLs del lado del cliente. Se utilizaba casi exclusivamente para realizar validaciones y acceder a los objetos del DOM para modificar algún atributo. El DOM es el modelo que mantiene el browser sobre el html que se está visualizando (y algunas cositas más). Si se modifica el dom, se modifica lo que se visualiza.
 
Hace unos años se comenzó a utilizar también para el servidor como parte de [Node](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links) y también para reemplazar el HTML como lenguaje de generación de interfaz grádica, siendo [Angular](https://angular.io/) uno de los primeras y más famoso frameworks para esto. Aunque en esta guía nos vamos a volcar por otra alternativa llamada [react](https://angular.io/).

El uso de Node + Angular fue potenciado por el gestor de paquetes [npm](https://www.npmjs.com/), una especie de Maven para JS que surgió como parte de Node. En lugar de declarar la estructura del proyecto en un pom.xml, npm utiliza un archivo llamado package.json. Npm presentó algunos problemas de performance y seguridad,  entonces Facebook desarrolló una alternativa llamada [yarn](https://yarnpkg.com) que utiliza las mismas definiciones en el package.json

Finalmente, para completar el conjunto de herramientas, este tipo de aplicaciones suele utilizar como medio persistnecia mongodb, siendo json el formato con el cual se guarda y comunican los datos. Json es muy utilizado en este tipo de arquitecturas porque básicamente un json es un objeto javascript, siendo muy sencillo su integración.

Existen otros frameworks que suelen complementarse con los descriptos anteriormente, nos ocuparemos de ellos en su momento.

Finalmente, con respecto al ide, existen muchas alternativas. Nosotros vamos a usar el [Visual Estudio Code] (https://code.visualstudio.com) con algunas plugins, aunque en este punto todo es opcional, bien se podría editar el código con cualquier editor, ya que javascript es interpretado.

### prerrequisitos
sudo apt-get install curl

### install node
```
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Si todo salió bien" 
``` 
node --version
```


### install yarn


```    
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Si todo salió bien" 
``` 
yarn --version
```

#### install visual estudio code

```
sudo snap install --classic code
```

Para abrirlo:
```
code
```

