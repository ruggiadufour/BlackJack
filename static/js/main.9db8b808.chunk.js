(this["webpackJsonpblack-jack"]=this["webpackJsonpblack-jack"]||[]).push([[0],{110:function(e,a){},116:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(8),o=t.n(c),i=(t(79),t(26)),l=t(67),m=t(11),u=t(44),s=t.n(u),d=t(64),g=t(65),b=t.n(g),p=t(151),h=t(147),E=t(154),f=t(153),j=t(152),v=b.a.connect("https://blackjack0.herokuapp.com/");function k(e){var a=e.valor;return r.a.createElement(p.a,{item:!0,xs:3},r.a.createElement(h.a,{style:{width:35,height:60,padding:5,background:"lightgray"}},r.a.createElement("h3",null,a[0]+""+a[1])))}function O(e){var a=e.jugador;return r.a.createElement("div",null,r.a.createElement(j.a,{variant:"h4",component:"h3",align:"center"},a.nombre),r.a.createElement("img",{src:"i1.png",alt:"crpr",width:"82",height:"122",style:{display:"block",margin:"auto"}}),r.a.createElement(p.a,{container:!0,spacing:0,justify:"center",alignContent:"center"},a.cartas.map((function(e,a){return r.a.createElement(k,{key:a,valor:e})}))),0!==a.total&&r.a.createElement(j.a,null,"Total: "+a.total))}var y={paper:{maxWidth:280,margin:"auto",padding:10}},w=function(){Object(n.useEffect)(Object(d.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(window.location.hostname);case 1:case"end":return e.stop()}}),e)}))),[]);var e=Object(n.useState)(0),a=Object(m.a)(e,2),t=a[0],c=a[1],o=Object(n.useState)(!1),u=Object(m.a)(o,2),g=u[0],b=u[1],k=Object(n.useState)("Sin nombre"),w=Object(m.a)(k,2),x=w[0],S=w[1],C=Object(n.useState)([]),M=Object(m.a)(C,2),B=M[0],T=M[1],I=Object(n.useState)(),J=Object(m.a)(I,2),W=J[0],z=J[1],N=Object(n.useState)(!1),P=Object(m.a)(N,2),R=P[0],q=P[1],H=Object(n.useState)(0),A=Object(m.a)(H,2),D=A[0],F=A[1],K=Object(n.useState)(5),L=Object(m.a)(K,2),U=L[0],V=L[1],Y=Object(n.useState)(!1),$=Object(m.a)(Y,2),G=$[0],Q=$[1],X=Object(n.useState)(""),Z=Object(m.a)(X,2),_=Z[0],ee=Z[1],ae=Object(n.useState)([]),te=Object(m.a)(ae,2),ne=te[0],re=te[1],ce=Object(n.useRef)(null);Object(n.useEffect)((function(){ce.current.scrollIntoView({behavior:"smooth"})}),[ne]),Object(n.useEffect)((function(){v.on("actualizarMensajes",(function(e){re((function(a){return[].concat(Object(l.a)(a),[e])}))})),v.on("setTiempo",(function(){!function(){var e=4,a=setInterval((function(){0===e?(clearInterval(a),V(5),console.log("se paro")):(console.log(e),V(e),e--)}),1e3)}()})),v.on("colorTurno",(function(e){F(e)})),v.on("actualizaCantidaOn",(function(e){oe(e),Q(e.juguemos)})),v.on("entrarMesa",(function(e){1===e.mensaje?oe(e):alert("No entraste a la mesa debido a que esta llena")})),v.on("jugar",(function(e){T(e.jugadoresMesa),z(e.croupier),Q(e.juguemos)})),v.on("darTurno",(function(){q(!0)}))}),[]);var oe=function(e){c(e.cantidadOn),T(e.jugadoresMesa),z(e.croupier)},ie=function(e){q(!1),v.emit("accionTurno",{accion:e.target.name})};return r.a.createElement("div",{className:"App",style:{background:"#34495E"}},r.a.createElement(h.a,{style:{height:"auto",minHeight:"100vh",background:"#34495E",margin:"auto",display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap",padding:10}},r.a.createElement(p.a,{direction:"row",container:!0,justify:"center",spacing:1},r.a.createElement(p.a,{item:!0,xs:12,sm:12,md:4,lg:4},r.a.createElement(j.a,{variant:"h4",component:"h1",align:"left"},"BlackJack"),r.a.createElement(j.a,{variant:"h5",component:"h3",align:"left"},"Usuarios conectados: ".concat(t)),r.a.createElement(f.a,{disabled:g,onChange:function(e){S(e.target.value)},value:x,label:"Nombre de usuario",variant:"filled",required:!0,style:{marginBottom:"10px"}}),r.a.createElement("br",null),r.a.createElement(E.a,{disabled:t>4||g,onClick:function(){b(!0),v.emit("entrarMesa",{codigo:1,nombre:x})},variant:"contained",color:"primary",style:{marginBottom:"10px"}},"Entrar a la mesa"),r.a.createElement(E.a,{disabled:!g,onClick:function(){b(!1),v.emit("entrarMesa",{codigo:0,nombre:x})},variant:"contained",color:"primary",style:{marginBottom:"10px"}},"Salir de la mesa"),r.a.createElement(h.a,{style:{maxHeight:"300px",overflowY:"scroll"},elevation:2},ne.map((function(e){return r.a.createElement("div",{style:{width:"100%",background:"#415364",border:"1px solid gray"}},r.a.createElement(j.a,{variant:"h6",component:"h4",align:"left"},e.nombre),r.a.createElement(j.a,{align:"left"},e.mensaje))})),r.a.createElement(f.a,{onChange:function(e){ee(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&""!==_&&(v.emit("enviarMensaje",{mensaje:_,nombre:x}),ee(""))},style:{width:"100%"},value:_,label:"Escribe un mensaje",variant:"filled"}),r.a.createElement("div",{ref:ce})),r.a.createElement("br",null),r.a.createElement("button",{hidden:G,onClick:function(){v.emit("jugar")}},"Juguemos")),r.a.createElement(p.a,{item:!0,xs:12,sm:12,md:8,lg:8},r.a.createElement("div",{style:Object(i.a)(Object(i.a)({},y.paper),{},{background:"#6969693a",border:"solid thin black",borderRadius:"15px",margin:"auto"})},W&&r.a.createElement(O,{jugador:W})),r.a.createElement("br",null),5!==U&&r.a.createElement("h3",null,"La partida comienza en ",U),r.a.createElement(p.a,{direction:"row",container:!0,justify:"center",spacing:2},B.map((function(e,a){return r.a.createElement(p.a,{item:!0,xs:12,sm:6,md:4,lg:4},r.a.createElement("div",{style:Object(i.a)(Object(i.a)({},y.paper),{},{background:e.pierde?"red":e.gana?"lightgreen":"#6969693a",border:"solid thin black",borderRadius:"15px",margin:"auto"}),elevation:2},D===a&&r.a.createElement(j.a,{variant:"h6",component:"h3",align:"center"},"Jugador en turno"),r.a.createElement(j.a,{variant:"h4",component:"h3",align:"center"},e.nombre),!0===e.gana&&r.a.createElement(j.a,{variant:"h5",component:"h3",align:"center"},"\xa1Felicidades ganaste!"),r.a.createElement("img",{src:"i3.png",alt:"jgdr",width:"70",height:"95",style:{display:"block",margin:"auto"}}),r.a.createElement(p.a,{container:!0,spacing:0,justify:"center",alignContent:"center"},e.cartas.map((function(e,a){return r.a.createElement(p.a,{key:a,item:!0,xs:3},r.a.createElement(h.a,{style:{width:35,height:60,padding:5,background:"lightgray"}},r.a.createElement("h3",null,e[0]+""+e[1])))}))),0!==e.total&&r.a.createElement(j.a,null,"Total: "+e.total),e.nombre===x&&r.a.createElement("div",{hidden:!R},r.a.createElement("button",{name:"pedir",onClick:ie},"Pedir"),r.a.createElement("button",{name:"pasar",onClick:ie},"Pasar"),r.a.createElement("button",{name:"doblar",onClick:ie},"Doblar"))))})))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},74:function(e,a,t){e.exports=t(116)},79:function(e,a,t){}},[[74,1,2]]]);
//# sourceMappingURL=main.9db8b808.chunk.js.map