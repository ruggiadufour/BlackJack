import React,{useEffect, useState} from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const socket = io.connect('http://localhost:4000');
 
function App() {
  useEffect(async ()=>{
    console.log(window.location.hostname)
  },[])

  const [cantidadOn, setcantidadOn] = useState(0);
  const [conectado, setconectado] = useState(false);
  const [nombre, setnombre] = useState("Unnamed");
  const [jugadores, setjugadores] = useState([]);
  const [croupier, setcroupier] = useState();
  const [turno, setturno] = useState(false);
  const [turnoColor, setturnoColor] = useState(0);
  const [tiempoReset, settiempoReset] = useState(5);
  const [juguemos, setjuguemos] = useState(false);

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
    socket.on('setTiempo', () => {
      DaleIntervalo()  
    })
    socket.on('colorTurno', (data) => {
      setturnoColor(data)
    })
    socket.on('actualizaCantidaOn', (data) => {
      actualizarDatos(data);
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
  const Crp = () => {
    if(croupier){
      return <Carta jugador={croupier}/>
    }
  }

  const accionTurno = (e) => {
    setturno(false);
    socket.emit('accionTurno', {accion: e.target.name});
  }

  return (
    <div className="App">
      <Paper style={{width:"auto", maxWidth: 950,background:"#34495E",margin:"auto",display:"flex",justifyContent: 'center',alignItems: 'center',flexWrap: 'wrap',padding: 10}}>
        <Grid direction="row" container justify="center" spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" align="left">
              BlackJack
            </Typography>
            <Typography variant="h5" component="h1" align="left">
              {`Conectados en la mesa: ${cantidadOn}`}
            </Typography>          
          </Grid>
          
          <Grid item xs={12}>
            <TextField disabled={conectado} onChange={cambiaNombre} value={nombre} label="Nombre de usuario" variant="filled" required/>
          </Grid>

          <Grid item xs={12}>
            <Button disabled={cantidadOn>4 || conectado} onClick={entrarMesa} variant="contained" color="primary">Entrar a la mesa</Button>
            <Button disabled={!conectado} onClick={salirMesa} variant="contained" color="primary">Salir de la mesa</Button>
          </Grid>

          <Grid item xs={12}>
            <Paper style={{...Estilos.paper, background:"#64ECFF"}} elevation={2}>
              {
                croupier &&
                <Ficha jugador={croupier}/>
              }  
            </Paper>
          </Grid>
          {
            tiempoReset!==5 && <h3>La partida comienza en {tiempoReset}</h3>
          }
          <Grid direction="row" container justify="center" spacing={2}>
          {
            jugadores.map((jugador, i) => (
              <Grid item xs={12} sm={4}>
                <Paper style={{...Estilos.paper, background: !jugador.pierde?jugador.gana?"lightgreen":"white":"red"}} elevation={2}>
                  {turnoColor===i && <h2>Jugador en turno</h2>}
                  <h1>{jugador.nombre}</h1>
                  {
                    jugador.gana === true &&
                    <h1>¡Felicidades ganaste!</h1>
                  }
                  <h5>Cartas:</h5>
                  <Grid container spacing={0} justify="center" alignContent="center">
                    {
                      jugador.cartas.map((carta, i) => (
                        <Grid key={i} item xs={3}>
                          <Paper style={{width:35, height:60, padding:5 ,background:"lightgray"}}>
                            <h5>{carta[0]+""+carta[1]}</h5>
                          </Paper>
                        </Grid>
                      ))
                    }
                  </Grid>
                  <h5>Total: {jugador.total}</h5>
                  {
                    jugador.nombre === nombre &&
                    <div hidden={!turno}>
                      <button name="pedir" onClick={accionTurno}>Pedir</button>
                      <button name="pasar" onClick={accionTurno}>Pasar</button>
                      <button name="doblar" onClick={accionTurno}>Doblar</button>
                    </div>
                  }
                </Paper>
              </Grid> 
            ))
          }
          </Grid>

          <Grid item xs={12}>
            <button disabled={juguemos} onClick={jugar}>Juguemos</button>
            {/*disabled={juguemos}*/}
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
        <h5>{valor[0]+""+valor[1]}</h5>
      </Paper>
    </Grid>
  )
}

function Ficha({jugador}) {
  return (
    <div>
      <h1>{jugador.nombre}</h1>
      <h5>Cartas:</h5>
      <Grid container spacing={0} justify="center" alignContent="center">
        {
          jugador.cartas.map((carta, i) => (
            <Carta key={i} valor={carta}/>
          ))
        }
      </Grid>
      <h5>Total: {jugador.total}</h5>
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
