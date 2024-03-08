async function fetchdata(csvFile) {
    try {
      const response = await fetch(csvFile);
      const csvData = await response.text();
      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: function (results) {
            var data = results.data;
            resolve(data);
          },
          error: function (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching CSV:', error);
    }
}
  
const csvFile = "data.csv";
  
let currentques=1;
let lastques = 7;
arr=["a","b","c","d"];
let correctans=0; 

let result={} //qno:[correctans,userans]
async function processdata() {
    let data = await fetchdata(csvFile);
    console.log(data);
  
    for (let i = 0; i < lastques; i++) {
      let div = document.createElement("div");
      div.classList.add(`question-number`);
      div.innerText = `${i + 1}`;
      let parentdiv = document.querySelector(".ques");
      parentdiv.append(div);
    }
    let quesno = document.querySelectorAll(".question-number");
    showques(1,data,quesno);
  
    
    for (let i = 0; i < quesno.length; i++) {
      quesno[i].addEventListener("click", () => {
        currentques = parseInt(quesno[i].innerText);
        showques(currentques,data,quesno);
      });
    }
    let next= document.querySelector(".next");
    next.addEventListener("click",()=>{
        if (currentques==lastques){
            alert("No Next Question")
        }
        else{
            currentques++;
            showques(currentques,data,quesno);
        }
    });
    let previous= document.querySelector(".previous");
    previous.addEventListener("click",()=>{
        if (currentques==1){
            alert("No Previous Question")
        }
        else{
            currentques--;
            showques(currentques,data,quesno);
        }
    });
    
    let submit= document.querySelector(".submit");
    submit.addEventListener("click",()=>{
        let div=document.querySelectorAll(".question-number");
        if(div[currentques-1].style.backgroundColor=="rgb(111, 200, 111)"){
            alert("Alredy Submitted");
        }
        else{
            let ans=data[currentques].answer;
            // console.log(ans);
            let q=document.getElementsByName("q");
            // console.dir(q);
            let flag=0;
            let val;
            for (let i=0; i<q.length; i++){
                if (q[i].checked){
                    val=q[i].value;
                    flag=1;
                    if (val==ans){
                        correctans+=1
                    }
                }
            }
            if (flag==0){
                alert("Select the answer");
            }else{
                result[currentques]=[ans,val];
                // console.log(result);
                div[currentques-1].style.backgroundColor="rgb(111, 200, 111)";
    
            }
        }

    })

    let finish= document.querySelector(".finish");
    finish.addEventListener("click",()=>{
        document.getElementById('loadingOverlay').style.display = 'flex';
        setTimeout(function () {
            document.getElementById('loadingOverlay').style.display = 'none';
            alert('Submission successful!');
        }, 2000); 
    })
    
   

}
processdata();

function showques(pos,data,quesno){
    let h2= document.querySelector(".question h2");
    h2.innerText=`Question ${pos}:`;
    let p= document.querySelector(".question p");
    p.innerText=`${data[pos-1].Question}`;
    let li= document.querySelectorAll("li");
    let i=0;
    for (k of arr){
        key="option"+" "+k;
        li[i].innerHTML=`${i+1} :<input type=\"radio\" name=\"q\" value=\"${k}\">  ${data[pos-1][key]}`;
        // console.dir(li[i]);
        i++;
        if (i==4){
            break;
        }
       
    }
    quesno[pos-1].classList.add("visited");

    let finish= document.querySelector(".finish");
    if (currentques==lastques){
        finish.classList.remove("z");
    }else{
        finish.classList.add("z");
    }
}