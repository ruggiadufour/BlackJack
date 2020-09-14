const express = require('express');
const app = express();
const path = require('path');

//Settings
app.set('port', process.env.PORT || 4000);

//Static files
//app.use(express.static(path.join(__dirname,'frontend'))); //path.join une el directorio actual con la carpeta public. Esto porque en windows y linux se utiliza / o \.

//Star server
const server = app.listen(app.get('port'), () => {
    console.log("server on port: ", app.get('port'));
});

//websockets:
const SocketIO = require('socket.io');
const io = SocketIO(server);

let Mesa = [];
let cantidadOn = 0;
io.on('connection', (socket) =>{
    console.log("alguien se conectó, su id es: ", socket.id);
    
    //io.sockets.emit('actualizaCantidaOn', cantidadOn);
    io.to(socket.id).emit('actualizaCantidaOn', cantidadOn);
    
    //Recibe la data que envia un cliente y se la reenvia a todos los demas
    socket.on('enviar', data =>{
        io.sockets.emit('enviar', data);
    })
    
    //Un usuario intenta entrar en la mesa para jugar, se incrementa el contador
    socket.on('entrarMesa', (value) =>{
        let mensaje = 1;
        //Si value es 1 significa que se presionó el boton entrar
        //Si value es 1 significa que se presionó el boton salir
        if(value === 1){
            //Si la cantidad es menor, dejamos entrar sino le damos un mensaje
            if(cantidadOn <= 2){
                //Agrega el id de un cliente al arreglo
                Mesa.push(socket.id.toString());
                cantidadOn++;

                mensaje = 1;
            }else{
                mensaje = 0;
            }
        }else{
            cantidadOn--;
            
            mensaje = 1;
        }
        io.sockets.emit('entrarMesa', {
            mensaje: mensaje,
            cantidad: cantidadOn
        }); 
    })

    socket.on('disconnect', () =>{
        console.log("se desconectó: ",socket.id);
        
        if(Mesa.some((value) => (value === socket.id.toString()))){
            //Saca a un cliente del arreglo cuando se desconecta
            Mesa = Mesa.filter((value) => (socket.id.toString() !== value));
            console.log("hola")
            //Decrementa la cantidad cuando el cliente sale de la sala o se desconecta
            cantidadOn--;
            io.sockets.emit('actualizaCantidaOn', cantidadOn);
        }
        
        
    })
    
})


