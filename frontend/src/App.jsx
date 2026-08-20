import { useState, useEffect } from "react";
import axios from "axios";

import {
  Upload,
  FileText,
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Brain,
  Search,
  CheckCircle,
  ArrowDown,
  Rocket,
  Sparkles
} from "lucide-react";

import "./App.css";


function App(){

const [file,setFile] = useState(null);
const [result,setResult] = useState(null);
const [loading,setLoading] = useState(false);
const [activeTab,setActiveTab] = useState("summary");


const [loadingStage,setLoadingStage] = useState(
"Extracting research information..."
);


const [fact,setFact] = useState(
"Did you know? The first scientific journal was published in 1665."
);



const stages=[

"Extracting research information...",
"Understanding the research question...",
"Analyzing methodology and datasets...",
"Mapping experimental results...",
"Evaluating research strengths...",
"Finding research limitations...",
"Generating future directions..."

];



const facts=[

"Did you know? The first scientific journal, Philosophical Transactions, was published in 1665 and helped establish modern scientific publishing.",

"Did you know? Many AI systems solve complex tasks by combining specialized agents that each focus on a different role.",

"Did you know? Scientists publish millions of research papers every year across fields like medicine, engineering, and physics."

];





useEffect(()=>{

if(!loading) return;


const stageTimer=setInterval(()=>{

setLoadingStage(
stages[Math.floor(Math.random()*stages.length)]
);

},6000);



const factTimer=setInterval(()=>{

setFact(
facts[Math.floor(Math.random()*facts.length)]
);

},15000);



return()=>{

clearInterval(stageTimer);
clearInterval(factTimer);

};


},[loading]);






async function analyzePaper(){


if(!file){

alert("Upload a PDF first");
return;

}


const formData=new FormData();

formData.append("file",file);



try{

setLoading(true);


const response=await axios.post(

"http://127.0.0.1:8000/analyze",

formData,

{
headers:{
"Content-Type":"multipart/form-data"
}
}

);



let clean=response.data.analysis
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();



setResult(JSON.parse(clean));


}

catch(error){

console.error(error);
alert(
"Analysis failed. Check backend logs."
);

}

finally{

setLoading(false);

}


}







const tabs=[

{
id:"summary",
name:"Research Summary",
icon:<FileText/>
},

{
id:"methodology",
name:"Methodology",
icon:<FlaskConical/>
},

{
id:"results",
name:"Results",
icon:<TrendingUp/>
},

{
id:"strengths",
name:"Strengths & Weaknesses",
icon:<AlertTriangle/>
},

{
id:"gaps",
name:"Research Gaps",
icon:<Search/>
},

{
id:"future",
name:"Future Experiments",
icon:<Rocket/>
}

];







// Improved parser
function cleanArray(value){


if(!value)
return [];


if(Array.isArray(value))
return value;



if(typeof value === "object")
return Object.values(value).flat();



return value

// split only numbered lists or new lines
.split(/\n(?=\d+[\.\)])|\n{2,}/)

.map(item=>

item
.replace(/^\d+[\.\)]\s*/,"")
.trim()

)

.filter(item=>item.length>10);


}









function renderSection(){


if(!result)
return null;



switch(activeTab){



case "summary":

return (

<div className="large-card">

<p>
{result.research_summary}
</p>

</div>

);






case "methodology":


const methods=cleanArray(result.methodology);


return (

<div className="pipeline">


{
methods.map((item,index)=>(

<div 
className="pipeline-step"
key={index}
>


<div className="pipeline-card">


<div className="number">

{String(index+1).padStart(2,"0")}

</div>


<p>
{item}
</p>


</div>



{
index !== methods.length-1 &&

<div className="center-arrow">

<ArrowDown/>

</div>

}



</div>


))
}


</div>

);









case "results":

return (

<div className="result-grid">

{
cleanArray(result.results)
.map((item,index)=>(


<div className="result-card" key={index}>

<div className="result-icon">
<TrendingUp/>
</div>


<p>
{item}
</p>


</div>


))
}

</div>

);









case "strengths":

return (

<div className="comparison">


<div className="weakness-box">


<h3>

<AlertTriangle/>

Weaknesses

</h3>


<ul>

{
cleanArray(result.weaknesses)
.map((x,i)=>(

<li key={i}>
{x}
</li>

))

}

</ul>


</div>







<div className="strength-box">


<h3>

<CheckCircle/>

Strengths

</h3>



<ul>

{
cleanArray(result.strengths)
.map((x,i)=>(

<li key={i}>
{x}
</li>

))

}

</ul>


</div>


</div>

);









case "gaps":

return (

<div className="result-grid">

{
cleanArray(result.research_gaps)
.map((x,i)=>(


<div className="result-card" key={i}>


<Search/>


<p>
{x}
</p>


</div>


))
}


</div>

);









case "future":

return (

<div className="future-list">


{
cleanArray(result.future_experiments)
.map((x,i)=>(


<div className="future-card" key={i}>


<div className="future-number">

{String(i+1).padStart(2,"0")}

</div>



<div>

<h3>
Research Direction
</h3>


<p>
{x}
</p>


</div>


</div>


))

}


</div>

);





default:

return null;


}


}









return (

<div className="app">



<nav className="navbar">


<div className="brand">


<div className="brand-logo">

<Sparkles size={22}/>

</div>


ResearchMate AI


</div>


</nav>








<section className="hero">


<h1>

Research intelligence for academic discovery.

</h1>


<p>

Analyze papers, uncover limitations, and generate future research directions in seconds.

</p>


</section>







<div className="upload-card">


<label className="upload-box">


<Upload size={45}/>


<h3>

{
file
?
file.name
:
"Upload Research Paper PDF"
}

</h3>


<p>
PDF documents only
</p>


<input

type="file"

accept=".pdf"

onChange={(e)=>setFile(e.target.files[0])}

/>


</label>




<button onClick={analyzePaper}>


{
loading
?
"Analyzing Paper..."
:
"Analyze Paper"

}


</button>



</div>









{
loading &&


<div className="loading-card">


<div className="ai-circle">

<Brain/>

</div>


<h2>
{loadingStage}
</h2>


<div className="spinner"></div>




<div className="fact-box">


<Lightbulb/>


<div>

<strong>
While you wait...
</strong>


<p>
{fact}
</p>


</div>


</div>


</div>


}









{
result &&


<div className="dashboard">


<div className="tabs">


{
tabs.map(tab=>(


<button

key={tab.id}

className={
activeTab===tab.id
?
"active"
:
""
}


onClick={()=>setActiveTab(tab.id)}

>

{tab.icon}

{tab.name}


</button>


))

}


</div>







<div className="content">


<h2>

{
tabs.find(
x=>x.id===activeTab
).name
}

</h2>



{renderSection()}



</div>


</div>


}



</div>


);


}


export default App;