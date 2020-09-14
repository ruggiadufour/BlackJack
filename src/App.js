import React,{useEffect, useState} from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [cantidadOn, setcantidadOn] = useState(0);
  const [conectado, setconectado] = useState(false);
  const [nombre, setnombre] = useState("Jugador");
  const [jugadores, setjugadores] = useState([]);

  useEffect(() => {
    socket.on('actualizaCantidaOn', (data) => {
      setcantidadOn(data);
      let jugador = "Jugador: "+data;
      setnombre(jugador);
    })
    //Obtiene la cantidad de usuarios conectados en la mesa
    socket.on('entrarMesa', function(data) {
      if(data.mensaje === 1){
        setcantidadOn(data.cantidad);
        setjugadores(data.jugadoresMesa);
        console.log(data.jugadoresMesa);
      }else{
        alert("No entraste a la mesa debido a que esta llena")
      }
    })

    socket.on('jugar', (data) => {
      setjugadores(data);
      console.log(data);
    })
  },[])
  
  const entrarMesa = (e) =>{
    //Hace algo segun si el boton entrar o salir es presionado
    if(e.target.name === "entrar"){
      setconectado(true);
      setnombre("Jugador: "+cantidadOn);

      socket.emit('entrarMesa',{
        codigo: 1,
        nombre: nombre
      });
      
    }
    if(e.target.name === "salir"){
      setconectado(false);
      socket.emit('entrarMesa',{
        codigo: 0,
        nombre: nombre
      });
    }
    
  }
  const jugar = () => {
    socket.emit('jugar', "asd");
  }
  const cambiaNombre = (e) => {
    setnombre(e.target.value);
    console.log(nombre)
  }
  return (
    <div className="App">
      <input type="text" onChange={cambiaNombre} value={nombre}></input>

      <button disabled={!conectado} name="salir" onClick={entrarMesa}>Salir de la mesa</button>
      <button disabled={cantidadOn>2 || conectado} name="entrar" onClick={entrarMesa}>Entrar a la mesa</button>
      <div>
        {
          jugadores.map((jugador, i) => (
            <Carta jugador={jugador} key={i}/>
          ))
        }
      </div>
      <p> 
        Conectados en la mesa: 
        {cantidadOn}
      </p>
      <hr/>
      <button onClick={jugar}>Juguemos</button>

    </div>
  );
}

function Carta({jugador}) {
  return (
    <div>
      <h1>{jugador.nombre}</h1>
      {
        jugador.cartas.map((carta, i) => (
          <h5 key={i}>{carta}</h5>
        ))
      }
    </div>
  )
}


export default App;
