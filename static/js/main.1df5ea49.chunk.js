(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e,t,a){},14:function(e,t,a){},15:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),l=a(3),s=a.n(l);a(13);const r=[{id:9,name:"General Knowledge"},{id:10,name:"Books"},{id:11,name:"Film"},{id:12,name:"Music"},{id:21,name:"Sports"},{id:23,name:"History"},{id:27,name:"Animals"}],o=["easy","medium","hard"];function m(){const[e,t]=Object(n.useState)(""),[a,l]=Object(n.useState)(""),[s,m]=Object(n.useState)(!1),[u,i]=Object(n.useState)(r[0].id),[d,p]=Object(n.useState)(o[0]),[b,E]=Object(n.useState)(5),[v,h]=Object(n.useState)(1),[S,g]=Object(n.useState)([]),[y,j]=Object(n.useState)(0),[k,O]=Object(n.useState)(""),[w,f]=Object(n.useState)(""),[N,C]=Object(n.useState)([]),[_,x]=Object(n.useState)(""),[$,q]=Object(n.useState)(!1),[M,R]=Object(n.useState)(0),[A,G]=Object(n.useState)(1),[H,I]=Object(n.useState)(!1);Object(n.useEffect)(()=>{T()},[]);const T=async()=>{const e=await fetch("https://opentdb.com/api_token.php?command=request"),a=await e.json();t(a.token)},B=async()=>{e&&await fetch(`https://opentdb.com/api_token.php?command=reset&token=${e}`)},F=async()=>{if(!e)return;const t=`https://opentdb.com/api.php?amount=${b}&type=multiple&category=${u}&difficulty=${d}&token=${e}`,a=await fetch(t),n=await a.json();0===n.response_code?(g(n.results),j(0),J(n.results,0)):4===n.response_code&&(alert("All available questions have been used. Resetting token..."),await B(),G(1),R(0))},J=(e,t)=>{const a=e[t];if(!a)return;O(a.question),f(a.correct_answer);const n=[...a.incorrect_answers,a.correct_answer];C(n.sort(()=>Math.random()-.5)),x(""),q(!1)};return c.a.createElement("div",{className:"trivia-container"},c.a.createElement("h1",{className:"title"},"Kahoot-Style Trivia"),!s&&c.a.createElement("div",{className:"name-entry"},c.a.createElement("input",{type:"text",placeholder:"Enter your name",value:a,onChange:e=>l(e.target.value)}),c.a.createElement("button",{onClick:()=>{a.trim()&&m(!0)}},"Continue")),s&&!k&&!H&&c.a.createElement("div",{className:"settings"},c.a.createElement("select",{value:u,onChange:e=>i(e.target.value)},r.map(e=>c.a.createElement("option",{key:e.id,value:e.id},e.name))),c.a.createElement("select",{value:d,onChange:e=>p(e.target.value)},o.map(e=>c.a.createElement("option",{key:e,value:e},e))),c.a.createElement("select",{value:b,onChange:e=>E(Number(e.target.value))},[3,5,10,15].map(e=>c.a.createElement("option",{key:e,value:e},e," Questions"))),c.a.createElement("select",{value:v,onChange:e=>h(Number(e.target.value))},[1,2,3,5].map(e=>c.a.createElement("option",{key:e,value:e},e," Rounds"))),c.a.createElement("button",{className:"start-btn",onClick:()=>{R(0),G(1),I(!1),F()}},"Start Game")),k&&!H&&c.a.createElement("div",{className:"question-box"},c.a.createElement("h2",{dangerouslySetInnerHTML:{__html:k},className:"question-text"}),c.a.createElement("div",{className:"answer-grid"},N.map((e,t)=>c.a.createElement("button",{key:t,className:`answer-btn btn-${t%4}`,onClick:()=>(e=>{e===w?(x("\u2705 Correct!"),R(e=>e+1)):x(`\u274c Wrong! Correct: ${w}`),q(!0)})(e),dangerouslySetInnerHTML:{__html:e}}))),_&&c.a.createElement("p",{className:"feedback"},_),$&&c.a.createElement("button",{className:"next-btn",onClick:()=>{const e=y+1;j(e),e<S.length?J(S,e):A<v?(G(e=>e+1),F()):(I(!0),B())}},"Next")),H&&c.a.createElement("div",{className:"scoreboard"},c.a.createElement("h2",null,"\ud83c\udf89 Game Over!"),c.a.createElement("p",null,"Player: ",c.a.createElement("strong",null,a)),c.a.createElement("p",null,"Rounds Completed: ",v),c.a.createElement("p",null,"Final Score: ",M," / ",v*b),c.a.createElement("button",{onClick:()=>I(!1)},"Play Again")),!H&&s&&c.a.createElement("div",{className:"score-box"},"Round ",A,"/",v," | Score: ",M))}var u=function(){return c.a.createElement("div",null,c.a.createElement(m,null))};a(14);s.a.createRoot(document.getElementById("root")).render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(u,null)))},4:function(e,t,a){e.exports=a(15)}},[[4,1,2]]]);
//# sourceMappingURL=main.1df5ea49.chunk.js.map