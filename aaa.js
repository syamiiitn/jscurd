var data;
var url='https://jsonplaceholder.typicode.com/posts';
var isNext=false;
var isPrev=true;
var start=0;
var end=5
var cbs='unchecked';
var count=0
var ids=[]
var editData;
var ranges=5;

document.getElementById("edit").disabled = true;
document.getElementById("del").disabled = true;

function closeModel(){
    document.getElementById('xadd').style.display='inline'
    document.getElementById('xedit').style.display='none'
    $("#myModal").modal("hide");
}

function edits(){
    console.log(editData)
    document.getElementById('id').value=editData.id
    document.getElementById('tt').value=editData.title
    document.getElementById('bd').value=editData.body
    document.getElementById('xadd').style.display='none'
    document.getElementById('xedit').style.display='inline'
    $("#myModal").modal("show");
}

async function ups(){
    let id=document.getElementById('id').value;
    let title=document.getElementById('tt').value;
    let body=document.getElementById('bd').value;
   if(id.length!=0 || title.length!=0 || body.length!=0){
        let obj={
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                body: body,
                id: editData.id,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }
        let response=await  fetch(`${url}/${id}`, obj)
        console.log(response)
        document.getElementById('id').value=''
        document.getElementById('tt').value=''
        document.getElementById('bd').value=''
        document.getElementById("edit").disabled = true;
        count=0;
        closeModel()
        getData()
   }else{
       alert('please enter details')
   }
}
async   function adds(){
        let id=document.getElementById('id').value;
        let title=document.getElementById('tt').value;
        let body=document.getElementById('bd').value;
       if(id.length!=0 || title.length!=0 || body.length!=0){
            let obj={
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    body: body,
                    id: id,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
            let response=await  fetch(url, obj)
            console.log(response)
            document.getElementById('id').value=''
            document.getElementById('tt').value=''
            document.getElementById('bd').value=''
            getData()
       }else{
           alert('please enter details')
       }
    }

async function getDel(){
    ids.forEach( async x=>{
        let response=await fetch(`${url}/${x}`)
        console.log(response)
    })
   await getData()
   document.getElementById("del").disabled = true;
   ids=[]
   count=0
}



async function getData() {
    let response = await fetch(url);
    data = await response.json();
    tableBody()
}

function tableBody(){
    console.log(data)
    let tBody=''
    for(let i of data.slice(start,end)){
     let tr=   `
            <tr>
                <td><input type='checkbox' ${cbs} onclick='counts(checked,${JSON.stringify(i)})'></td>
                <td>${i.id}</td>
                <td>${i.title}</td>
                <td>${i.body}</td>
            </tr>
       
            `
        tBody=tBody+tr
    }
    document.getElementById('tb').innerHTML=tBody
}



function setSize(event){
    start=0;
    document.getElementById('prev').disabled = true;
    end=parseInt(event)
    ranges=parseInt(event)
    tableBody()
}   

function counts(val,i){
    if(val){
        ids.push(i.id)
        count++;
    }else{
        ids=ids.filter(x=>{
            if(x!=i.id){
                return x;
            }
        })
        count--;
    }
    if(count==1){
        document.getElementById("edit").disabled = false;
        document.getElementById("del").disabled = true;
        editData=i;
    }else if(count==0){
        document.getElementById("del").disabled = true;
        document.getElementById("edit").disabled = true;
    }
    else{
        document.getElementById("edit").disabled = true; 
        document.getElementById("del").disabled = false; 
    }
}

function check(val){
    if(val){
        cbs='checked'
        tableBody();
    }else{
        cbs='unchecked'
        tableBody();
    }
}


function next(){
  start=start+ranges;
  end=end+ranges;
  tableBody()
  document.getElementById('prev').disabled = false;
  if(end==data.length){
      document.getElementById('next').disabled = true;
  }
  }

function  previous(){
    start=start-ranges;
    end=end-ranges;
    tableBody()
    document.getElementById('next').disabled = false;
    if(start==0){
        document.getElementById('prev').disabled = true;
    }
  }