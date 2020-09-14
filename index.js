const express = require('express');
const app = express();
const path = require('path');
const { emit } = require('process');

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

let jugadoresMesa = [];
let cantidadOn = 0;
let Cartas = [1,2,3,4,5,6,7,8,9,10,11,12,13];
let turno = 0;
io.on('connection', (socket) =>{
    console.log("alguien se conectó, su id es: ", socket.id);
    
    //io.sockets.emit('actualizaCantidaOn', cantidadOn);
    io.to(socket.id).emit('actualizaCantidaOn', cantidadOn);
    
    //Un usuario intenta entrar en la mesa para jugar, se incrementa el contador
    socket.on('entrarMesa', (value) =>{
        let mensaje = 1;
        //Si value es 1 significa que se presionó el boton entrar
        //Si value es 1 significa que se presionó el boton salir
        console.log(value)
        if(value.codigo === 1){
            //Si la cantidad es menor, dejamos entrar sino le damos un mensaje
            if(cantidadOn <= 2){
                //Agrega el id de un cliente al arreglo
                jugadoresMesa.push({
                    nombre: value.nombre,
                    id: socket.id.toString(),
                    cartas: []
                });
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
            mensaje, mensaje,
            cantidad: cantidadOn,
            jugadoresMesa: jugadoresMesa
        }); 
    })

    socket.on('disconnect', () =>{
        console.log("se desconectó: ",socket.id);
        
        if(jugadoresMesa.some((value) => (value.id === socket.id.toString()))){
            //Saca a un cliente del arreglo cuando se desconecta
            jugadoresMesa = jugadoresMesa.filter((value) => (socket.id.toString() !== value.id));
            console.log("hola")
            //Decrementa la cantidad cuando el cliente sale de la sala o se desconecta
            cantidadOn--;
            io.sockets.emit('actualizaCantidaOn', cantidadOn);
            io.sockets.emit('jugar', jugadoresMesa);
        }                 
    })

    socket.on('jugar', ()=> {
        if(turno < 2){
            let cartasRepartidas = [];
            for (let j = 0; j < 2; j++) {
                let ar = [];
                for (let i = 0; i < jugadoresMesa.length; i++) {
                    //ar.push(Cartas.pop())
                    jugadoresMesa[i].cartas.push(Cartas.pop());
                
                }  
                cartasRepartidas.push()
            }
            console.log("object")
            io.sockets.emit('jugar', jugadoresMesa);
        }
    })
    
})


