var telefonemask= document.getElementById('telefone')
var cepmask= document.getElementById('cep')
var vrua= document.getElementById('rua')
var vbairro=document.getElementById('bairro')
var vcidade=document.getElementById('cidade')
var vuf= document.getElementById('uf')
var inputs=document.getElementsByTagName('input')
var formenv=document.getElementById('form_enviar')
var formcad=document.getElementById('right')
var formlist=document.getElementById('container_list')
var buttoncad=document.getElementById('cadastrabtnl')
var buttonlist=document.getElementById('listabtnl')
var buttoncadform=document.getElementById('btn_cadastro')
var titleforms=document.getElementsByTagName('h1')
var usrid=0
var arrlen=0;
var tela=1;
var alterar=false
var deletar=false
var cf=false
buttonlist.addEventListener('click',function(){
    formcad.style.display='none'
    formlist.style.display='block'
    buttonlist.style.backgroundColor='#568CFE'
    buttoncad.style.backgroundColor='#56ccf2'
    alterar=false
    deletar=false
    if(tela != 2){

        listApi()
    }
    tela=2
})
buttoncad.addEventListener('click',function(){
    alterar=false
    deletar=false
    titleforms[0].style.color='#56ccf2'
    buttoncadform.innerText='Cadastrar'
    titleforms[0].innerText='Cadastro'
    formcad.style.display='block'
    buttonlist.style.backgroundColor='#56ccf2'
    formlist.style.display='none'
    buttoncad.style.backgroundColor='#568CFE'
    
    if(tela==2){
        zerainp()
        reinitlist()
    }
    tela=1
})
function validmask(ele,val){
  
    var teste=  document.querySelector('#'+ele+'')
    if(val.length >= 12 && val.length <= 15  ){
          try{
             newval2= val.replace(/(\d{3})(\d{5})(\d{4})/,'($1) $2-$3')
             teste.type='text'
             teste.value=newval2
         }catch(erro){
             teste.value= ''
         }
        }else{
            teste.value=''
        }
       
}

function maskcep(cep){
        url= 'https://viacep.com.br/ws/'+cep+'/json/'
        xhr= new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.onreadystatechange= function(){
            if(xhr.readyState== 4 ){
            if( xhr.status == 200){
                data=xhr.responseText
                 maskcep2(data)
            }
        }
        }
        xhr.send()

}

function maskcep2(data){
    cepv= JSON.parse(data)
   
    vuf.value=cepv.uf
    vrua.value=cepv.logradouro
    vbairro.value=cepv.bairro
    vcidade.value=cepv.localidade
    cepmask.value=cepv.cep
}

cepmask.addEventListener('blur', function(){
    valor=cepmask.value

    if(valor.length == 8){
        newv=parseInt(valor)
        if( Number.isInteger(newv)){
            cepmask.value=''
           cepmask.placeholder='Carregando......'
            maskcep(valor)
    }else{
        cepmask.value=''
    }
       
    }else{
        cepmask.value=''
    }
   
})

telefonemask.addEventListener('focus',function(){
    telefonemask.type='number'
})
telefonemask.addEventListener('blur',function(evt){
    var valor=telefonemask.value
      
    validmask('telefone',valor)
})

formenv.addEventListener('submit',function(event){
    event.preventDefault()
     var data={
            'seu_email':inputs[0].value,
            'nome':inputs[5].value,
            'email':inputs[1].value,
            'telefone':inputs[6].value,
            'rua':inputs[2].value,
            'numero':inputs[7].value,
            'complemento':inputs[3].value,
            'bairro':inputs[8].value,
            'cep':inputs[4].value,
            'cidade':inputs[9].value,
            'uf':inputs[10].value,
            
        }
         dataj=JSON.stringify(data)
    if(alterar==false && deletar==false){
        dataj=JSON.stringify(data)
        sendApi(data,"POST","https://estagio.eficazmarketing.com/api/user")
    }else if(deletar==false && alterar==true){
        console.log(data)

        sendApi(dataj,"PUT","https://estagio.eficazmarketing.com/api/user/"+usrid)
    }
})

function sendApi(data,type,url){
    xhr= new  XMLHttpRequest()
    url=url
    
    xhr.open(type,url)
    xhr.setRequestHeader('Content-type','json')
    xhr.send(data)
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status==200){
                data2=xhr.responseText
                console.log('Enviou ',data2)
            }
        }
    }
}

function listApi(){
    xhr= new XMLHttpRequest()
    url='https://estagio.eficazmarketing.com/api/user'
    xhr.open('GET',url)
   
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            data=xhr.responseText
           populateList(data)
        }
    }
    xhr.send()
}

var cardcontact=document.getElementsByClassName('cont_listsec4')

var cardbox=document.getElementsByTagName('center')

var btnalterar =''
var btnexcluir=''

function populateList(data){
    dataj= JSON.parse(data)
    newcard=cardcontact[0].cloneNode(true)
    if(cardcontact.length > 5){
        for(var i= cardcontact.length-1; i > 0; i=i-1){
            cardcontact[i].remove()
        
        }
    }
        arrlen=dataj.length
    dataj.forEach( function(item){
        newcard=cardcontact[0].cloneNode(true)
        nome=item.nome.trim()
        newcard.querySelector('.nomecard').innerHTML= "<p>"+nome+'</p>'
        newcard.querySelector('.e_mailcard').innerHTML='<p>'+item.email+'</p>'
        newcard.querySelector('.enderecocard').innerHTML='<p>'+item.rua+'<br/>'+item.bairro+'<br/>'+item.cep+'<br/>'+item.cidade+'</p>'
        newcard.querySelector('.telefonecard').innerHTML='<p>'+item.telefone+'</p>'
        newcard.querySelector('.itb1').name= item.id
        newcard.querySelector('.itb2').name=item.id
        cardbox[0].appendChild(newcard)
    })
    cardcontact[0].remove()
    btnalterar= document.querySelectorAll(".itb1")
    btnexcluir= document.querySelectorAll(".itb2")
    listalista(btnexcluir)
    listalista(btnalterar)
}

function reinitlist(){
    if(cardcontact.length > 1){
        for(var i=arrlen-1; i >= 1; i= i-1){
            cardcontact[i].remove()
        }
    }
    
}

function listalista(btn){
for(var i=0 ; i < btn.length; i++ ){

    btn[i].addEventListener('click',function(evt){
        usrid=evt.path[0].name
        if(evt.path[0].defaultValue != 'Excluir'){
            buscadadosalt(evt.path[0].name)
            usrid=evt.path[0].name
        }else if(evt.path[0].defaultValue != 'Alterar'){

            chamabox(usrid)
        }
        
    })
}
}
var boxexc=document.getElementById('opexcluir')
function chamabox(usrid){
    var boxexc=document.getElementById('opexcluir')
    var btncexc=document.querySelector(".bt1opexc")
    var btnccancelar=document.querySelector(".bt2opexc")
    btncexc.addEventListener('click',function(){
        cf=true
        sendexc(usrid)
    })
    btnccancelar.addEventListener('click',function(){
        cf=false
        boxexc.style.display="none"

    })
    boxexc.style.display="flex"
    formlist.style.position="relative"



}
function sendexc(usrid){
    xhr= new XMLHttpRequest()
    url= "https://estagio.eficazmarketing.com/api/user/"+usrid
    xhr.open("DELETE",url)
    xhr.send()
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            console.log(xhr.responseText)
            listApi()
            boxexc.style.display="none"
        }
    }
}

function buscadadosalt(id){
    var xhr= new XMLHttpRequest()
    var url='https://estagio.eficazmarketing.com/api/user/'+id
    xhr.open('GET',url)
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            data=xhr.responseText
            enviadadosparaalt(data)
        }
    }
    xhr.send('')
}
function zerainp(){
    for(var i=0 ; i <=10; i++){
        inputs[i].value=""
    }
}

function enviadadosparaalt(data){
    formcad.style.display='block'
    buttonlist.style.backgroundColor='#56ccf2'
    formlist.style.display='none'
    buttoncad.style.backgroundColor='#568CFE'
    buttoncadform.innerText='Alterar'
    titleforms[0].innerText='Alterar'
    titleforms[0].style.color='#27AE60'
    alterar=true
    chamaformaltera(data)
}
function chamaformaltera(data){
    seu_email=inputs[0]
    nome=inputs[5]
    email=inputs[1]
    telefone=inputs[6]
    rua=inputs[2]
    numero=inputs[7]
    complemento=inputs[3]
    bairro=inputs[8]
    cep=inputs[4]
    cidade=inputs[9]
    uf=inputs[10]
    dataj=JSON.parse(data)
   seu_email.value=dataj.seu_email
   nome.value=dataj.nome
   email.value=dataj.email
   telefone.value=dataj.telefone
   rua.value=dataj.rua
   numero.value=dataj.numero
   complemento.value=dataj.complemento
   bairro.value=dataj.bairro
   cep.value=dataj.cep
   cidade.value=dataj.cidade
   uf.value=dataj.uf


}