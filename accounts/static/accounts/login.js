document.getElementById("loginForm").addEventListener("submit", async (e) =>{
    e.preventDefault();

    let form = e.target;
    let formData = new FormData(form);

    // Api calling
    let res = await fetch('/api/login/', {
        method: "POST",
        body: formData,
        headers: {"X-CSRFToken": formData.get("csrfmiddlewaretoken")}
    });

    let result = await res.json();

    // Showing message login successful or Failed
    let msgbox = document.getElementById("msg");

    if(!msgbox){
        msgbox = document.createElement("div");
        msgbox.id = "msg";
        form.appendChild(msgbox);
    }

    if(result.status){
        msgbox.innerText = result.msg;
        msgbox.style.color = "lightgreen";

        setTimeout(() =>{
            window.location.href = "/home/";
        }, 1000)
    }
    else{
        msgbox.innerText = result.msg;
        msgbox.style.color = "red";
    }
});