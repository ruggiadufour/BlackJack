const express = require('express');
const app = express();
const path = require('path');

//Settings
app.set('port', process.env.PORT || 4000);

//Static files
app.use(express.static(path.join(__dirname,'public'))); //path.join une el directorio actual con la carpeta public. Esto porque en windows y linux se utiliza / o \.

//Star server
const server = app.listen(app.get('port'), () => {
    console.log("server on port: ", app.get('port'));
});

//websockets:
const SocketIO = require('socket.io');
const io = SocketIO(server);

let jugadoresMesa = [];
let cantidadOn = 0;
let Cartas = [3,4,5,6,7,8,9,3,4,5,6,7,8,9,3,4,5,6,7,8,9,3,4,5,6,7,8,9,3,4,5,6,7,8,9,3,4,5,6,7,8,9,];
let turno = 0;

//Croupier
let croupier = {
    nombre: "Croupier Ruggia",
    cartas: [],
    total: 0,
}
let cartaX;


io.on('connection', (socket) =>{
    const actualizar = () =>{
        io.sockets.emit('actualizaCantidaOn',{
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier
        })
    }
    const jugar = () =>{
        if(turno < 2){
            //Se reparten las cartas
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < jugadoresMesa.length; i++) {
                    jugadoresMesa[i].cartas.push(Cartas.pop());
                    jugadoresMesa[i].total +=  jugadoresMesa[i].cartas[jugadoresMesa[i].cartas.length-1];
                    if(jugadoresMesa[i].total>21){
                        jugadoresMesa[i].pierde = true;
                    }
                }
                if(j === 1){
                    cartaX = Cartas.pop();
                    croupier.cartas.push(0);
                    croupier.total = croupier.cartas[0];
                }
                else{
                    croupier.cartas.push(Cartas.pop());
                }

            }
            //Enviamos las cartas repartidas a los jugadores
            io.sockets.emit('jugar', {
                jugadoresMesa: jugadoresMesa,
                croupier: croupier
            });
        }

        //Pasamos el turno al jugador que no se haya pasado
        let i = jugadoresMesa.findIndex((el) => el.total<21);
        if(i != -1){
            turno=i;
            io.to(jugadoresMesa[i].id).emit('darTurno');
        }
        else
        console.log("todos ganaron");
    }
    const comprobarFinalizacion = () =>{
        if(turno+1 === jugadoresMesa.length){
            //Sumamos las cartas del croupier
            croupier.total = croupier.total+cartaX;
            croupier.cartas[1] = cartaX;
            while(croupier.total<=16){
                let pop = Cartas.pop();
                croupier.total += pop;
                croupier.cartas.push(pop);
            }

            //Comprobamos si los jugadores ganaron al croupier
            for(let x = 0 ; x < jugadoresMesa.length; x++){
                if(jugadoresMesa[x].total>=croupier.total && jugadoresMesa[x].total<=21 || croupier.total>21 && jugadoresMesa[x].total<=21){
                    jugadoresMesa[x].gana = true;
                }else{
                    jugadoresMesa[x].pierde = true;
                }
            }
            actualizar();
            io.sockets.emit('setTiempo');

            setTimeout(()=>{
                croupier.cartas = [];
                croupier.total = 0;
                turno = 0;

                jugadoresMesa = jugadoresMesa.map((jugador)=>{
                    jugador.cartas = [];
                    jugador.total = 0;
                    jugador.pierde = false;
                    jugador.gana = false;

                    return jugador;
                })
                actualizar();
                jugar();
            },4000);
        }else{
            turno++;
            io.to(jugadoresMesa[turno].id).emit('darTurno');
            
            console.log(jugadoresMesa[turno].cartas);
            /**
             * if(jugadoresMesa[turno].cartas){
                turno++
                if(turno!==jugadoresMesa.length){
                    io.to(jugadoresMesa[turno].id).emit('darTurno');
                }else{
                    comprobarFinalizacion();
                }
            }else{
                io.to(jugadoresMesa[turno].id).emit('darTurno');
            }
             */
        }
    }
    console.log("alguien se conectó, su id es: ", socket.id);
    
    actualizar();
    
    //Un usuario intenta entrar en la mesa para jugar, se incrementa el contador
    socket.on('entrarMesa', (value) =>{
        let mensaje = 1;
        //Si value es 1 significa que se presionó el boton entrar
        //Si value es 1 significa que se presionó el boton salir
        if(value.codigo === 1){
            //Si la cantidad es menor, dejamos entrar sino le damos un mensaje
            if(cantidadOn <= 5){
                //Agrega el id de un cliente al arreglo
                jugadoresMesa.push({
                    nombre: value.nombre,
                    id: socket.id.toString(),
                    cartas: [],
                    total: 0,
                    pierde: false,
                    gana: false,
                });
                cantidadOn++;

                mensaje = 1;
            }else{ 
                mensaje = 0;
            }
        }else{
            mensaje = 1;
            salirMesa();
        }
        io.sockets.emit('entrarMesa', {
            mensaje, mensaje,
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier
        }); 
    })

    //Cuando se desconecta alguien, tenemos que saber si estaba en la mesa para sacarlo
    socket.on('disconnect', () =>{
        console.log("se desconectó: ",socket.id);
        
        if(jugadoresMesa.some((value) => (value.id === socket.id.toString()))){
            salirMesa();
        }                 
    })

    socket.on('jugar', ()=> {
        jugar();
    })

    socket.on('accionTurno', (data) =>{
        if(jugadoresMesa[turno].id === socket.id){
            if(data.accion === "pedir" && jugadoresMesa[turno].total<21){
                jugadoresMesa[turno].cartas.push(Cartas.pop());
                jugadoresMesa[turno].total +=  jugadoresMesa[turno].cartas[jugadoresMesa[turno].cartas.length-1];

                
                if(jugadoresMesa[turno].total<=21){
                    actualizar()
                    io.to(jugadoresMesa[turno].id).emit('darTurno');
                }
                else{
                    jugadoresMesa[turno].pierde = true;
                    actualizar();
                    
                    comprobarFinalizacion();
                }                
            }else{
                comprobarFinalizacion();                
            }
            
        }
    })
    
    const salirMesa = () => {
        //Saca a un cliente del arreglo cuando se desconecta
        jugadoresMesa = jugadoresMesa.filter((value) => (socket.id.toString() !== value.id));
        //Decrementa la cantidad cuando el cliente sale de la sala o se desconecta
        cantidadOn--;
        io.sockets.emit('actualizaCantidaOn', {
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier
        });
    }
    
})


