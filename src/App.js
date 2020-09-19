import React,{useEffect, useState} from 'react';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const socket = io.connect('http://localhost:4000');
 


function App() {
  const [cantidadOn, setcantidadOn] = useState(0);
  const [conectado, setconectado] = useState(false);
  const [nombre, setnombre] = useState("Unnamed");
  const [jugadores, setjugadores] = useState([]);
  const [croupier, setcroupier] = useState();
  const [turno, setturno] = useState(false);
  const [id, setid] = useState("");


  useEffect(() => { 
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
    })

    socket.on('darTurno',() =>{
      setturno(true);
    })
  },[])
  
  const actualizarDatos = (data) => {
    setcantidadOn(data.cantidadOn);
    setjugadores(data.jugadoresMesa);
    console.log(data.jugadoresMesa);
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
    socket.emit('jugar', "asd");
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
            <Paper style={{...Estilos.paper, background:"#8CC139"}} elevation={2}>
              {
                croupier &&
                <Carta jugador={croupier}/>
              }  
            </Paper>
          </Grid>
          <Grid direction="row" container justify="center" spacing={2}>
          {
            jugadores.map((jugador, i) => (
              <Grid item xs={12} sm={4}>
                <Paper style={{...Estilos.paper, background: jugador.pierde?"red":"white"}} elevation={2}>
                  <h1>{jugador.nombre}</h1>
                  {
                    jugador.gana === true &&
                    <h1>¡Felicidades ganaste!</h1>
                  }
                  <h5>Cartas:</h5>
                  {
                    jugador.cartas.map((carta, i) => (
                      <h5 key={i}>{carta}</h5>
                    ))
                  }
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
            <button disabled={!conectado} onClick={jugar}>Juguemos</button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

function Carta({jugador}) {
  return (
    <div>
      <h1>{jugador.nombre}</h1>
      <h5>Cartas:</h5>
      {
        jugador.cartas.map((carta, i) => (
          <h5 key={i}>{carta}</h5>
        ))
      }
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
