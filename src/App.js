import React,{useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const socket = io.connect('https://blackjack0.herokuapp.com/');
 
function App() {
  useEffect(async ()=>{
    console.log(window.location.hostname)
  },[])

  const [cantidadOn, setcantidadOn] = useState(0);
  const [conectado, setconectado] = useState(false);
  const [nombre, setnombre] = useState("Sin nombre");
  const [jugadores, setjugadores] = useState([]);
  const [croupier, setcroupier] = useState();
  const [turno, setturno] = useState(false);
  const [turnoColor, setturnoColor] = useState(0);
  const [tiempoReset, settiempoReset] = useState(5);
  const [juguemos, setjuguemos] = useState(false);
  const [mensaje, setmensaje] = useState("");
  const [mensajes, setmensajes] = useState([]);

  //Para que se muestren los ultimos mensajes
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [mensajes]);
  //

 function DaleIntervalo(){
  let ii = 4;
  let intervalo = setInterval(()=>{
    if(ii===0){
      clearInterval(intervalo);
      settiempoReset(5);
      console.log("se paro")
    }else{
      console.log(ii);
      settiempoReset(ii);
      ii--;
    }
  },1000)
 }
  useEffect(() => { 
    socket.on('actualizarMensajes', (data) => {
      setmensajes(msjs=>[...msjs, data]) 
    })
    socket.on('setTiempo', () => {
      DaleIntervalo()  
    })
    socket.on('colorTurno', (data) => {
      setturnoColor(data)
    })
    socket.on('actualizaCantidaOn', (data) => {
      actualizarDatos(data);
      setjuguemos(data.juguemos)
    })
    //Obtiene la cantidad de usuarios conectados en la mesa
    socket.on('entrarMesa', function(data) {
      if(data.mensaje === 1){
        actualizarDatos(data);
      }else{
        alert("No entraste a la mesa debido a que esta llena")
      }
    })

    socket.on('jugar', (data) => {
      setjugadores(data.jugadoresMesa);
      setcroupier(data.croupier);
      setjuguemos(data.juguemos);
      
    })

    socket.on('darTurno',() =>{
      setturno(true);
    })
  },[])
  
  const actualizarDatos = (data) => {
    setcantidadOn(data.cantidadOn);
    setjugadores(data.jugadoresMesa);
    setcroupier(data.croupier);
  }

  const entrarMesa = () =>{
    setconectado(true);

    socket.emit('entrarMesa',{
      codigo: 1,
      nombre: nombre
    });

  }
  const salirMesa = () =>{
    setconectado(false);
    socket.emit('entrarMesa',{
      codigo: 0,
      nombre: nombre
    });    
  }

  const jugar = () => {
    socket.emit('jugar');
  }
  const cambiaNombre = (e) => {
    setnombre(e.target.value);
  }
  const cambiaMensaje = (e) => {
    setmensaje(e.target.value);
  }
  const Crp = () => {
    if(croupier){
      return <Carta jugador={croupier}/>
    }
  }

  const accionTurno = (e) => {
    setturno(false);
    socket.emit('accionTurno', {accion: e.target.name});
  }

  const enviarMensaje = (e) => {
    if(mensaje!==""){
      socket.emit('enviarMensaje', {mensaje: mensaje, nombre: nombre});
      setmensaje("")
    }
  }

  return (
    <div className="App" style={{background:"#34495E"}}>
      <Paper style={{height: "auto", minHeight:"100vh",background:"#34495E",margin:"auto",display:"flex",justifyContent: 'center',alignItems: 'center',flexWrap: 'wrap',padding: 10}}>
        <Grid direction="row" container justify="center" spacing={1}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography variant="h4" component="h1" align="left">
              BlackJack
            </Typography>
            <Typography variant="h5" component="h3" align="left">
              {`Usuarios conectados: ${cantidadOn}`}
            </Typography>     
          
            <TextField disabled={conectado} onChange={cambiaNombre} value={nombre} label="Nombre de usuario" variant="filled" required style={{marginBottom:"10px"}}/>
            <br></br>
            <Button disabled={cantidadOn>4 || conectado} onClick={entrarMesa} variant="contained" color="primary" style={{marginBottom:"10px"}}>Entrar a la mesa</Button>
            <Button disabled={!conectado} onClick={salirMesa} variant="contained" color="primary" style={{marginBottom:"10px"}}>Salir de la mesa</Button>
          
            <Paper style={{maxHeight:"300px", overflowY:"scroll"}} elevation={2}>
              {
                mensajes.map(msj=>(
                  <div style={{width:"100%",background:"#415364",border:"1px solid gray"}}>
                    <Typography variant="h6" component="h4" align="left">
                      {msj.nombre}
                    </Typography>
                    <Typography align="left">
                      {msj.mensaje}
                    </Typography>
                  </div>
                ))
              }
              <TextField onChange={cambiaMensaje} onKeyPress={(e)=>{
                if(e.key==='Enter'){
                  enviarMensaje()
                }
              }} style={{width:"100%"}} value={mensaje} label="Escribe un mensaje" variant="filled"/>
              <div ref={messagesEndRef} />
            </Paper>
            <br/>
            <button hidden={juguemos} onClick={jugar}>Juguemos</button>
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={8}>
            <div style={{...Estilos.paper,background:"#6969693a",border:"solid thin black",borderRadius:"15px", margin:"auto"}}>
              {
                croupier &&
                <Ficha jugador={croupier}/>
              }  
            </div>
          <br/>
          {
            tiempoReset!==5 && <h3>La partida comienza en {tiempoReset}</h3>
          }
          <Grid direction="row" container justify="center" spacing={2}>
          {
            jugadores.map((jugador, i) => (
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <div style={{...Estilos.paper, background: !jugador.pierde?jugador.gana?"lightgreen":"#6969693a":"red",border:"solid thin black",borderRadius:"15px", margin:"auto"}} elevation={2}>
                  {
                    turnoColor===i && 
                    <Typography variant="h6" component="h3" align="center">
                      Jugador en turno
                    </Typography>
                  }
                  
                  <Typography variant="h4" component="h3" align="center">
                    {jugador.nombre}
                  </Typography>
                  {
                    jugador.gana === true &&
                    <Typography variant="h5" component="h3" align="center">
                      ¡Felicidades ganaste!
                    </Typography>
                  }
                  <img src="i3.png" alt="jgdr" width="70" height="95" style={{display:"block", margin: "auto"}} ></img>
                  <Grid container spacing={0} justify="center" alignContent="center">
                    {
                      jugador.cartas.map((carta, i) => (
                        <Grid key={i} item xs={3}>
                          <Paper style={{width:35, height:60, padding:5 ,background:"lightgray"}}>
                            <h3>{carta[0]+""+carta[1]}</h3>
                          </Paper>
                        </Grid>
                      ))
                    }
                  </Grid>
                  {jugador.total!==0 && <Typography>{"Total: "+jugador.total}</Typography>}
                  {
                    jugador.nombre === nombre &&
                    <div hidden={!turno}>
                      <button name="pedir" onClick={accionTurno}>Pedir</button>
                      <button name="pasar" onClick={accionTurno}>Pasar</button>
                      <button name="doblar" onClick={accionTurno}>Doblar</button>
                    </div>
                  }
                </div>
              </Grid> 
            ))
          }
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

function Carta({valor}){
  return(
    <Grid item xs={3}>
      <Paper style={{width:35, height:60, padding:5 ,background:"lightgray"}}>
        <h3>{valor[0]+""+valor[1]}</h3>
      </Paper>
    </Grid>
  )
}

function Ficha({jugador}) {
  return (
    <div>
      <Typography variant="h4" component="h3" align="center">
        {jugador.nombre}
      </Typography>
      <img src="i1.png" alt="crpr" width="82" height="122" style={{display:"block", margin: "auto"}} ></img>
      <Grid container spacing={0} justify="center" alignContent="center">
        {
          jugador.cartas.map((carta, i) => (
            <Carta key={i} valor={carta}/>
          ))
        }
      </Grid>
      {jugador.total!==0 && <Typography>{"Total: "+jugador.total}</Typography>}
    </div>
  )
}

const Estilos = {
  paper:{
    maxWidth:280,
    margin: "auto",
    padding: 10,
  }
}

export default App;
