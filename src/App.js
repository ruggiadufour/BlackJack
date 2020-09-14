import React,{useEffect, useState} from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:4000');

function App() {
  const [i, seti] = useState(3);
  const [cantidadOn, setcantidadOn] = useState(0);
  const [conectado, setconectado] = useState(false);
  const auxiliar = [
    {mensaje: "Mensaje 0"},
    {mensaje: "Mensaje 1"},
    {mensaje: "Mensaje 2"}
  ];
  const [mensajes, setMensajes] = useState(auxiliar);

  useEffect(() => {
    socket.on('actualizaCantidaOn', (data) => {
      setcantidadOn(data);
      console.log(data)
    })
    //Recibe un mensaje y lo pone en el arreglo de mensajes
    socket.on('enviar', function(data) {
      setMensajes((dataPrevia) =>[...dataPrevia, data]);
    })
    //Obtiene la cantidad de usuarios conectados en la mesa
    socket.on('entrarMesa', function(data) {
      if(data.mensaje === 1){
        setcantidadOn(data.cantidad);
      }else{
        alert("No entraste a la mesa debido a que esta llena")
      }
      
    })
  },[])

  const enviar = () =>{
    //Enviamos un mensaje a todos los clientes
    socket.emit('enviar', {
      mensaje: `Mensaje ${i}`
    })
    seti(i+1);
  }
  const entrarMesa = (e) =>{
    //Hace algo segun si el boton entrar o salir es presionado
    if(e.target.name === "entrar"){
      setconectado(true);
      socket.emit('entrarMesa',1);
    }
    if(e.target.name === "salir"){
      setconectado(false);
      socket.emit('entrarMesa',0);
    }
    
  }
  return (
    <div className="App">
        <div>
          Mensajes:
          {
            mensajes.map((mensaje,i) => (
              <p key={i}>
                {
                  mensaje.mensaje
                }
              </p>
            ))
          }
        </div>
        
        <button onClick={enviar}>Enviar</button>
        <button disabled={!conectado} name="salir" onClick={entrarMesa}>Salir de la mesa</button>
        <button disabled={cantidadOn>1 || conectado} name="entrar" onClick={entrarMesa}>Entrar a la mesa</button>

        <p> 
          Conectados en la mesa: 
          {cantidadOn}
        </p>
          
      
    </div>
  );
}

export default App;
