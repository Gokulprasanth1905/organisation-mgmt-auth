document.getElementById("createEmployeeBtn").addEventListener("click", async (e) =>{
    e.preventDefault();
    let form = document.getElementById("createEmployeeForm");
    let formData = new FormData(form);

    console.log(formData)

    let res = await fetch("/api/create_employee", {
        method: "POST",
        body: formData,
        headers: {"X-CSRFToken": formData.get("csrfmiddlewaretoken")}
    });
    let result = await res.json();
    msgbox =  document.getElementById("msg");

    if(!msgbox){
        msgbox = document.createElement("div");
        msgbox.id = "msg";
        form.appendChild(msgbox);
    }

    if(result.status){
        msgbox.innerText = result.msg
        msgbox.style.color = "lightgreen",
        msgbox.style.marginTop = "10px";
        setTimeout(() =>{
            document.getElementById("createEmployeeForm").reset();
            msgbox.innerText = ""
        }, 1000)
    }
    else{
        msgbox.innerText = result.msg
        msgbox.style.color = "red",
        msgbox.style.marginTop = "10px";
    }
});