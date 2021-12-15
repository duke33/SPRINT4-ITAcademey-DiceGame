# Dice Game API

## Instrucciones

- Crear un archivo `.env` en el el directorio root con el siguiente contenido:

```
PORT=3000
MONGODB_URI=mongodb://localhost:[27017]/dice-game
MYSQL_PORT=[3306]
MYSQL_HOST=localhost
MYSQL_USERNAME=[username]
MYSQL_PASSWORD=[password]
SECRET=banana
```

- Reemplazar los corchetes y su contenido con los valores propios (no incluir [ ]).
- La aplicacion se puede ejecutar desde consola, con persistencia en MongoDB o MySQL, usando los scripts:

```
npm run mongo-persistence
```

```
npm run mysql-persistence
```

- Los endpoints y la funcionalidad se pueden testear con [esta](https://github.com/mariano-farace/SPRINT4-ITAcademey-DiceGame/blob/main/postman_collection.json) coleccion de postman.
- El nombre de usuario y contraseña para loguearse como administrador son `admin` y `12345` respectivamente. Por defecto, se encuentran guardados en el body de la request llamada Login en postman

> Notar que en postman, el token generado en el login es guardado automaticamente por una funcion, en una variable de entorno propia de postman (ver pestaña `Test` del la request `Login`). Este token es pasado a todas las request de la coleccion, mediante herencia de configuracion. Esta configuracion heredada esta seteada en la pestaña que corresponde al nombre de la coleccion. Por lo tanto, por defecto, una vez logueado, todos los endpoints son autenticados, ya que poseen el token. Para ver como la aplicacion trata los errores de logueo, se puede desactivar esta configuracion desde la pestaña dicha, o tambien pasar un nombre de usuario o contraseña incorrectos desde el endpoint /login.
