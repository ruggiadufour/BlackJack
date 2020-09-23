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

//Variables
let jugadoresMesa = [];
let cantidadOn = 0;
let turno = 0;
let juguemos = false;
let mazo = [
    [1,"c"],[2,"c"],[3,"c"],[4,"c"],[5,"c"],[6,"c"],[7,"c"],[8,"c"],[9,"c"],[10,"c"],[10,"c"],[10,"c"],[10,"c"],
    [1,"d"],[2,"d"],[3,"d"],[4,"d"],[5,"d"],[6,"d"],[7,"d"],[8,"d"],[9,"d"],[10,"d"],[10,"d"],[10,"d"],[10,"d"],
    [1,"t"],[2,"t"],[3,"t"],[4,"t"],[5,"t"],[6,"t"],[7,"t"],[8,"t"],[9,"t"],[10,"t"],[10,"t"],[10,"t"],[10,"t"],
    [1,"p"],[2,"p"],[3,"p"],[4,"p"],[5,"p"],[6,"p"],[7,"p"],[8,"p"],[9,"p"],[10,"p"],[10,"p"],[10,"p"],[10,"p"],
];
let Cartas = fisherYates([...mazo]);
//Algoritmo de desordenamiento de mazo
function fisherYates(array){
    var count = array.length,
    randomnumber,
    temp;
    while( count ){
        randomnumber = Math.random() * count-- | 0;
        temp = array[count];
        array[count] = array[randomnumber];
        array[randomnumber] = temp
    }
    return array;
}
//Croupier
let croupier = {
    nombre: "Croupier",
    cartas: [],
    total: 0,
}
let cartaX;


io.on('connection', (socket) =>{
    const actualizar = () =>{
        io.sockets.emit('actualizaCantidaOn',{
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier,
            juguemos: juguemos,
        })
    }
    const jugar = () =>{
        if(turno < 2){
            //Si no hay cartas, debemos obtener un nuevo mazo
            if(Cartas.length === 0){
                Cartas = fisherYates([...mazo])
                console.log("Se obtiene un nuevo mazo")
            }
            //Se reparten las cartas
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < jugadoresMesa.length; i++) {
                    jugadoresMesa[i].cartas.push(Cartas.pop());
                    jugadoresMesa[i].total +=  jugadoresMesa[i].cartas[jugadoresMesa[i].cartas.length-1][0];
                    jugadoresMesa[i].entraMesa = true;
                    if(jugadoresMesa[i].total>21){
                        jugadoresMesa[i].pierde = true;
                    }
                }
                if(j === 1){
                    cartaX = Cartas.pop();
                    croupier.cartas.push(["0","X"]);
                    croupier.total = croupier.cartas[0][0];
                }
                else{
                    croupier.cartas.push(Cartas.pop());
                }

            }
            //Enviamos las cartas repartidas a los jugadores
            io.sockets.emit('jugar', {
                jugadoresMesa: jugadoresMesa,
                croupier: croupier,
                juguemos,
            });
        }

        //Pasamos el turno al jugador que no se haya pasado
        let i = jugadoresMesa.findIndex((el) => el.total<21);
        if(i != -1){
            turno=i;
            io.to(jugadoresMesa[i].id).emit('darTurno');
            io.sockets.emit('colorTurno', turno);
        }
        else
        console.log("todos ganaron");
    }
    const comprobarFinalizacion = () =>{
        //Si no hay cartas, debemos obtener un nuevo mazo
        if(Cartas.length === 0){
            Cartas = fisherYates([...mazo])
            console.log("Se obtiene un nuevo mazo")
        }
        if(turno+1 === jugadoresMesa.length){
            //Sumamos las cartas del croupier
            croupier.total = croupier.total+cartaX[0];
            croupier.cartas[1] = cartaX;
            while(croupier.total<=16){
                let pop = Cartas.pop();
                croupier.total += pop[0];
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
            do{
                if(jugadoresMesa[turno].total===0){
                    if(turno!==jugadoresMesa.length-1){
                        turno++
                        //io.to(jugadoresMesa[turno].id).emit('darTurno');
                    }else{
                        comprobarFinalizacion();
                        break;
                    }
                }else{
                    io.to(jugadoresMesa[turno].id).emit('darTurno');
                    io.sockets.emit('colorTurno', turno);
                }     
            }while(jugadoresMesa[turno].total===0)
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
                    entraMesa: false,
                });
                jugadoresMesa[jugadoresMesa.length-1].total = 0;
                cantidadOn++;
                mensaje = 1;
                juguemos = true;
            }else{ 
                mensaje = 0;
            }
        }else{
            mensaje = 1;
            if(jugadoresMesa.some((value) => (value.id === socket.id.toString()))){
                salirMesa();
            }
        }
        io.sockets.emit('entrarMesa', {
            mensaje, mensaje,
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier,
            juguemos: juguemos,
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
        //Si no hay cartas, debemos obtener un nuevo mazo
        if(Cartas.length === 0){
            Cartas = fisherYates([...mazo])
            console.log("Se obtiene un nuevo mazo")
        }
        console.log(jugadoresMesa[turno].id, socket.id)
        if(jugadoresMesa[turno].id === socket.id){
            if(data.accion === "pedir" && jugadoresMesa[turno].total<21){
                jugadoresMesa[turno].cartas.push(Cartas.pop());
                jugadoresMesa[turno].total +=  jugadoresMesa[turno].cartas[jugadoresMesa[turno].cartas.length-1][0];

                
                if(jugadoresMesa[turno].total<=21){
                    actualizar()
                    io.to(jugadoresMesa[turno].id).emit('darTurno');
                    io.sockets.emit('colorTurno', turno);
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
        //Si el jugador sale cuando es su turno debemos pasarselo al siguiente jugador
        let estabaEnMesa = false;
        if(jugadoresMesa[turno].id===socket.id.toString()){
            estabaEnMesa = true;
        }
        //Saca a un cliente del arreglo cuando se desconecta
        jugadoresMesa = jugadoresMesa.filter((value) => (socket.id.toString() !== value.id));
        
        //Decrementa la cantidad cuando el cliente sale de la sala o se desconecta
        cantidadOn--;
        if(estabaEnMesa && cantidadOn!==0){
            do{
                if(jugadoresMesa[turno].total===0){
                    if(turno!==jugadoresMesa.length-1){
                        turno++
                    }else{
                        comprobarFinalizacion();
                        break;
                    }
                }else{
                    io.to(jugadoresMesa[turno].id).emit('darTurno');
                    io.sockets.emit('colorTurno', turno);
                }     
            }while(jugadoresMesa[turno].total===0)
        }else{
            croupier.cartas = [];
            croupier.total = 0;
            turno = 0;
            juguemos = false;
        }

        
        io.sockets.emit('actualizaCantidaOn', {
            cantidadOn: cantidadOn,
            jugadoresMesa: jugadoresMesa,
            croupier: croupier,
            juguemos: juguemos,
        });
    }
    
})


