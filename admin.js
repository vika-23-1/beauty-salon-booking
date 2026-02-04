
function login() {
    fetch('/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            login: login.value,
            password: password.value
        })
    }).then(r=>{
        if(r.ok){
            panel.style.display='block';
            load();
        } else alert('Ошибка входа');
    })
}

function load(){
    fetch('/api/appointments').then(r=>r.json()).then(data=>{
        list.innerHTML='';
        data.forEach(a=>{
            list.innerHTML+=`<li>${a.date} ${a.time} ${a.client_name} (${a.service})
            <button onclick="del(${a.id})">X</button></li>`;
        })
    })
}

function del(id){
    fetch('/api/appointments/'+id,{method:'DELETE'}).then(load)
}

form.onsubmit=e=>{
    e.preventDefault();
    fetch('/api/appointments',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            client_name:client.value,
            service:service.value,
            master:master.value,
            date:date.value,
            time:time.value
        })
    }).then(load)
}
